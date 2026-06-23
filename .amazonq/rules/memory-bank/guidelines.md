# City Quest Explorer — Development Guidelines

## Backend (NestJS / TypeScript)

### Module Structure Convention
Every domain follows a strict 4-file layout. New domains must mirror this pattern exactly:

```
src/<domain>/
├── dto/                        # One DTO class per operation
├── <domain>.module.ts          # Wires controllers + providers
├── <domain>.controller.ts      # HTTP layer only — no logic
└── <domain>.service.ts         # All business logic lives here
```

### Controller Conventions
- Annotate every controller with `@ApiTags('<domain>')` and `@Controller('<domain>')`.
- Annotate every handler with `@ApiOperation({ summary: '...' })` (Spanish summaries are fine and consistent with the codebase).
- Protect write endpoints with `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()`. Read-only endpoints may be public.
- Extract the authenticated user via `@User('id') userId: string` — never read `request.user` directly.
- Handler methods return the service result directly (no wrapping).

```typescript
@Post('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Iniciar sesión de juego' })
createSession(@Body() payload: CreateSessionDto) {
  return this.gamesService.createSession(payload);
}
```

### Service Conventions
- Inject `PrismaService` as `private readonly prisma`.
- Throw `NotFoundException` (from `@nestjs/common`) when a required entity is not found — include a Spanish message.
- Use `prisma.<model>.findUnique` for ID lookups; `findFirst` for business-logic queries with multiple `where` conditions.
- Always pass `include: { ... }` to return related entities needed by the client in a single query.
- For conditional updates, build a `Record<string, unknown>` update object and call `update` only if it has keys.
- Use Prisma atomic operators (`{ increment: N }`) for score fields — never read-then-write.

```typescript
// Conditional score update pattern
const updateData: Record<string, unknown> = {};
if (payload.eventType === EventType.CHECKPOINT_REACHED) {
  updateData.score = { increment: 10 };
}
if (Object.keys(updateData).length) {
  await this.prisma.gameSession.update({ where: { id: sessionId }, data: updateData });
}
```

### DTO Conventions
- Every DTO field must have both a `class-validator` decorator and an `@ApiProperty(...)` decorator.
- Use `@IsOptional()` + `@IsString()` for nullable/optional string fields.
- Use `@IsEnum(EnumType)` for enum fields; export the enum from the DTO file so services can import it directly.
- Use `@IsObject()` + `@IsNotEmpty()` for JSON payload fields typed as `Record<string, unknown>`.

```typescript
export enum EventType {
  LOCATION_UPDATE = 'LOCATION_UPDATE',
  QR_SCANNED = 'QR_SCANNED',
}

export class CreateSessionEventDto {
  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ example: { latitude: 40.4168, longitude: -3.7038 } })
  @IsObject()
  @IsNotEmpty()
  eventData: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  checkpointId?: string;
}
```

### Module Registration
- Import `PassportModule` and `JwtModule.register({...})` inside the module that owns the strategy, not in AppModule.
- `JwtModule.register` reads `process.env.JWT_SECRET` with a hardcoded fallback for local dev.
- `PrismaModule` is globally available — do not re-import it in feature modules.
- Export services only when another module needs to inject them.

### Authentication Architecture
The app uses **Supabase Auth exclusively** (legacy local auth is disabled):

1. Client authenticates with Supabase and receives a JWT.
2. JWT is sent as `Authorization: Bearer <token>`.
3. `SupabaseJwtStrategy` (extends `PassportStrategy(Strategy, 'jwt')`) verifies the token using `SUPABASE_JWT_SECRET` or `JWT_SECRET`.
4. On successful validation, `SupabaseUserSyncService.upsertFromSupabaseUser()` is called to sync/create the user in the Prisma DB.
5. The strategy returns `{ id: sub, email, name, role }` — this object is accessible via `@User()`.

`SupabaseJwksClient` provides an alternative JWKS-based (RS256) verification path; it caches the JWKS for 10 minutes in memory.

- `SUPABASE_JWKS_URL` env var must be set for JWKS verification.
- `x5c[0]` from the JWKS key is used to construct the PEM public key.
- Throw `UnauthorizedException` (never expose internal error details) on any token failure.

### TypeScript Patterns
- `strict: true` is enabled; `strictPropertyInitialization: false` is the only relaxation.
- `experimentalDecorators` and `emitDecoratorMetadata` are enabled — required for NestJS DI.
- Cast JSON/unknown fields with `as unknown as object` when Prisma expects `InputJsonValue`.
- Use `Record<string, unknown>` for dynamic objects rather than `any`.
- Avoid `any` except in Passport strategy `validate(payload: any)` where the JWT shape is not guaranteed.
- Prefix unused parameters with `_` (e.g. `_email`, `_app`) to satisfy the compiler without eslint-disable.

### Prisma Conventions
- All IDs are `@id @default(uuid())` — string UUIDs, never integers.
- Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`.
- Enum values are `SCREAMING_SNAKE_CASE` in both Prisma schema and TypeScript enums.
- Relation fields use explicit `@relation(fields: [...], references: [...])`.
- `PrismaService` implements `OnModuleInit` (`$connect`) and `OnModuleDestroy` (`$disconnect`).
- After any schema change run `npm run prisma:generate` before building.

### Error Handling
- Services throw NestJS HTTP exceptions (`NotFoundException`, `UnauthorizedException`) — never raw `Error`.
- Error messages are in Spanish (consistent with the project).
- Disabled/legacy methods throw `UnauthorizedException` with a descriptive message rather than being deleted.

---

## Mobile (Flutter / Dart)

### App Initialization Order
`main()` must follow this exact sequence:
1. `WidgetsFlutterBinding.ensureInitialized()`
2. `dotenv.load(fileName: '.env')`
3. `Supabase.initialize(url: ..., anonKey: ...)`
4. `runApp(ProviderScope(child: CityQuestApp()))`

### State Management
- All providers use Riverpod. The entire app is wrapped in `ProviderScope`.
- Do not use `StatefulWidget` for state that needs to be shared — use providers instead.

### Navigation
- All routes are declared in `app_router.dart` as `GoRoute` entries.
- `initialLocation: '/login'` — auth guard logic to redirect authenticated users will be added via `redirect` callback.
- Route paths use lowercase kebab-style strings: `/missions`, `/qr`, `/ranking`.
- Screen classes are `const` constructors.

### Feature Structure
Features live under `lib/features/<feature>/presentation/screens/`. As a feature grows, add:
```
lib/features/<feature>/
├── data/          # Repository implementations, data sources
├── domain/        # Entities, use cases, repository interfaces
└── presentation/
    └── screens/   # Screen widgets
```

### Environment Variables (Mobile)
- Loaded via `flutter_dotenv`; the `.env` file is declared as an asset in `pubspec.yaml`.
- Access with `dotenv.env['KEY']!` — use `!` only for required values.
- Never hardcode Supabase URLs or keys.

---

## Infrastructure & Environment

### Required `.env` Variables (Backend Root)
```
DATABASE_URL=postgresql://user:password@host:5432/city_quest?schema=public
JWT_SECRET=<strong-random-secret>
SUPABASE_JWT_SECRET=<from-supabase-dashboard>
SUPABASE_JWKS_URL=https://<project-ref>.supabase.co/auth/v1/jwks
PORT=3000
```

### Docker Local Dev
- `docker-compose up -d` starts both `db` (postgres:16) and `app` (NestJS).
- The `app` service sets `DATABASE_URL` to `postgres://postgres:postgres@db:5432/city_quest` — this is only for Docker; local dev uses the root `.env`.
- Always run `npm run prisma:migrate` after pulling schema changes.

### Scoring Rules (Game Logic Reference)
| Event | Score Increment |
|---|---|
| `CHECKPOINT_REACHED` | +10 |
| `QR_SCANNED` | +5 |
| `SESSION_FINISHED` | status → `COMPLETED`, sets `finishedAt` |

### Comments & Language
- Inline code comments are written in **Spanish** throughout the backend codebase — maintain this convention.
- Flutter/Dart code comments may be in either language; match the surrounding code.
- Spanish error messages in NestJS exceptions are standard (e.g. `'Ruta no encontrada'`).

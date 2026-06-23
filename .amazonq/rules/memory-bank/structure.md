# City Quest Explorer — Project Structure

## Repository Layout

```
City Quest Explorer/
├── src/                        # NestJS backend API
│   ├── app.module.ts           # Root module — imports all feature modules
│   ├── main.ts                 # Bootstrap: Swagger, ValidationPipe, CORS, port
│   ├── auth/                   # Authentication (Supabase JWT + local fallback)
│   ├── city/                   # City CRUD
│   ├── routes/                 # Route CRUD (GPS routes within a city)
│   ├── games/                  # Game sessions and session events
│   ├── teams/                  # Team management
│   ├── users/                  # User profile management
│   ├── rankings/               # Leaderboard per route
│   ├── prisma/                 # PrismaService (singleton DB client)
│   └── common/
│       ├── guards/             # JwtAuthGuard (passport 'jwt' strategy)
│       └── decorators/         # @User() param decorator
│
├── prisma/
│   ├── schema.prisma           # Data model (PostgreSQL, Prisma ORM)
│   └── migrations/             # SQL migration history
│
├── mobile/                     # Flutter cross-platform mobile app
│   ├── lib/
│   │   ├── main.dart           # App entry: Supabase.initialize + ProviderScope
│   │   ├── routes/
│   │   │   └── app_router.dart # GoRouter route definitions
│   │   ├── core/
│   │   │   ├── auth/           # Auth state/service utilities
│   │   │   └── network/        # Dio HTTP client setup
│   │   └── features/           # Feature-first folder structure
│   │       ├── auth/           # Login / Register screens
│   │       ├── gps/            # GPS tracking screen
│   │       ├── map/            # Map view screen
│   │       ├── missions/       # Mission list screen
│   │       ├── profile/        # User profile screen
│   │       ├── qr/             # QR scanner screen
│   │       └── ranking/        # Leaderboard screen
│   ├── android/                # Android runner
│   ├── ios/                    # iOS runner
│   ├── windows/                # Windows runner (Win32 + Flutter)
│   ├── linux/                  # Linux runner (CMake)
│   ├── macos/                  # macOS runner
│   ├── web/                    # Web runner
│   └── pubspec.yaml            # Flutter dependencies
│
├── supabase/
│   └── config.toml             # Supabase project configuration
│
├── Documentos/                 # Product/design docs (Spanish) — not deployed
├── Historias/                  # Narrative assets and story scripts
├── docker-compose.yml          # Local dev: postgres:16 + NestJS app
├── Dockerfile                  # Backend container image
├── .env / .env.example         # Environment variables (root = backend)
└── *.dart (root)               # Loose Flutter/Dart files (utilities, models)
```

---

## Backend Architecture (NestJS)

Each domain follows a consistent **Module → Controller → Service → DTO** pattern:

```
src/<domain>/
├── dto/                 # Input validation classes (class-validator)
├── <domain>.module.ts   # @Module({ controllers, providers, imports })
├── <domain>.controller.ts  # HTTP route handlers, @UseGuards(JwtAuthGuard)
└── <domain>.service.ts  # Business logic, calls PrismaService directly
```

- **PrismaModule** is global; `PrismaService` extends `PrismaClient` and connects on `onModuleInit`.
- **AuthModule** registers `PassportModule` + `JwtModule`; uses `SupabaseJwtStrategy` as the Passport strategy named `'jwt'`.
- **JwtAuthGuard** wraps `AuthGuard('jwt')` and is applied per-controller or per-route via `@UseGuards`.
- **@User()** param decorator extracts the authenticated user from `request.user`.

---

## Data Model Relationships (Prisma)

```
City ──< Route ──< Checkpoint ──< QRCode
              └──< Team ──< TeamMember >── User
              └──< GameSession ──< SessionEvent
              └──< Ranking
```

Key enums: `Role`, `Difficulty`, `MemberRole`, `SessionStatus`, `EventType`

---

## Mobile Architecture (Flutter)

- **State management**: Riverpod (`flutter_riverpod`) — `ProviderScope` wraps the entire app
- **Navigation**: GoRouter (`go_router`) — declarative routes defined in `app_router.dart`
- **Auth**: Supabase Flutter SDK; initialized in `main()` before `runApp`
- **HTTP**: Dio for API calls to the NestJS backend
- **Feature structure**: each feature has `presentation/screens/` at minimum; expands to `data/` and `domain/` layers as needed

---

## Infrastructure

| Component | Technology |
|---|---|
| Local DB | PostgreSQL 16 (Docker) |
| Cloud auth/DB | Supabase |
| Backend container | Dockerfile + docker-compose |
| API docs | Swagger UI at `/api` |
| ORM | Prisma 5 |

# City Quest Explorer — Technology Stack

## Backend (NestJS API)

| Technology | Version | Role |
|---|---|---|
| TypeScript | ^5.6.2 | Primary language |
| Node.js | 20+ (LTS) | Runtime |
| NestJS | ^10.2.5 | HTTP framework (decorators, DI, modules) |
| Prisma ORM | ^5.10.0 | Database client + migrations |
| PostgreSQL | 16 (Docker) / Supabase cloud | Relational database |
| Passport.js | ^0.6.0 | Auth middleware |
| @nestjs/passport | ^11.0.5 | NestJS Passport integration |
| @nestjs/jwt | ^11.0.2 | JWT signing/verification |
| passport-jwt | ^4.0.1 | JWT extraction strategy |
| jose | ^5.6.0 | JWKS-based Supabase token verification |
| jsonwebtoken | ^9.0.2 | Direct JWT operations |
| class-validator | ^0.15.0 | DTO validation via decorators |
| class-transformer | ^0.5.1 | Request body transformation |
| @nestjs/swagger | ^8.0.7 | Auto-generated OpenAPI docs |
| helmet | ^7.0.0 | HTTP security headers |
| bcrypt | ^5.1.1 | Password hashing (legacy, optional) |
| dotenv | ^17.4.2 | Environment variable loading |

### TypeScript Configuration
- Target: `ES2023`, module: `CommonJS`
- `strict: true` with `strictPropertyInitialization: false`
- `experimentalDecorators: true`, `emitDecoratorMetadata: true` (required for NestJS DI)
- Output: `dist/`, source root: `src/`

### Testing
- Jest 29 + ts-jest — test files match `**/*.spec.ts`
- Coverage output to `coverage/` directory
- Run: `npm test` | `npm run test:watch`

---

## Mobile (Flutter)

| Technology | Version | Role |
|---|---|---|
| Dart SDK | ^3.12.0 | Language |
| Flutter | stable | Cross-platform UI framework |
| flutter_riverpod | ^2.6.1 | State management |
| go_router | ^14.2.0 | Declarative navigation |
| supabase_flutter | ^2.6.0 | Auth + realtime client |
| dio | ^5.7.0 | HTTP networking |
| flutter_secure_storage | ^9.2.2 | Secure token storage |
| mobile_scanner | ^6.0.0 | QR code scanning |
| flutter_dotenv | ^5.2.1 | `.env` config loading |
| flutter_cache_manager | ^3.3.1 | Media/asset caching |
| json_annotation | ^4.9.0 | JSON serialization helpers |

### Target Platforms
iOS, Android, Web, Windows, macOS, Linux

---

## Infrastructure & DevOps

| Component | Technology |
|---|---|
| Containerization | Docker + docker-compose (postgres:16-alpine + app) |
| Cloud auth | Supabase (JWT via JWKS endpoint) |
| Cloud DB option | Supabase PostgreSQL |
| Local DB | Docker postgres:16 on port 5432 |
| API docs | Swagger UI — `http://localhost:3000/api` |

---

## Development Commands

### Backend
```bash
# Install dependencies
npm install

# Development (hot reload)
npm run start:dev

# Production build
npm run build

# Start production
npm start

# Prisma
npm run prisma:generate     # Regenerate Prisma client after schema changes
npm run prisma:migrate      # Deploy pending migrations

# Tests
npm test
npm run test:watch

# Lint
npm run lint
```

### Docker (full local stack)
```bash
docker-compose up -d        # Start postgres + backend
docker-compose down         # Stop
docker-compose logs -f app  # Follow backend logs
```

### Flutter / Mobile
```bash
cd mobile

flutter pub get             # Install packages
flutter run                 # Run on connected device/emulator
flutter build apk           # Android release
flutter build ios           # iOS release
flutter test                # Run widget tests
```

---

## Required Environment Variables

### Backend (`.env` at project root)
```env
DATABASE_URL="postgresql://user:password@host:5432/city_quest?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN=3600          # seconds (optional, defaults to 3600)
PORT=3000                    # optional, defaults to 3000
```

### Mobile (`mobile/.env`)
```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
```

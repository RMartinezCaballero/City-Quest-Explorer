# CITY QUEST EXPLORER — PLAN MAESTRO DE EJECUCIÓN (SOT)

> **Este es el único archivo de seguimiento y referencia del proyecto.**
> Todo agente, desarrollador o colaborador debe leerlo antes de trabajar.
> **Última actualización:** Junio 2026 | **Fase 1 COMPLETADA** | **Fase 2 COMPLETADA (Parcial)** | **Deploy pendiente**

---

## 1. VISIÓN Y PROPUESTA DE VALOR

**Plataforma:** Aventuras urbanas geolocalizadas que convierten ciudades reales en escenarios de misterio e investigación.

**Manifiesto:** "Cada ciudad esconde secretos. Tú puedes ayudarnos a resolverlos."

**Historia piloto:** *El Manuscrito Prohibido* — Cartagena de Indias, Colombia.

**Modelo de negocio (presupuesto cero en software):**
- Precio individual: **100.000 COP / jugador**
- Precio equipo (≤5 personas): **400.000 COP**
- Corporativo básico: **2.500.000 COP** (10–20 pers)
- Corporativo premium: **5.000.000 COP** (20–50 pers)
- Franquicia: cuota inicial **~15.000.000 COP** + royalty 8%
- Margen bruto estimado: **~48%** (~48.000 COP/jugador)
- Punto de equilibrio: **~260–270 jugadores/mes** (~9/día)

---

## 2. STACK TECNOLÓGICO (DECISIÓN FINAL)

| Capa | Tecnología | Plan | Límite gratuito |
|------|-----------|------|----------------|
| App móvil | Flutter (iOS/Android) | Open source | — |
| Backend | **NestJS** (mantenido) | Render Free | 750h/mes, 512MB RAM |
| Base de Datos | **Supabase PostgreSQL** | Free | 500MB DB, 50k MAU |
| Auth | **Supabase Auth** (JWT) | Free | 50k usuarios |
| Mapas | **OpenStreetMap** (flutter_map) | Free | Ilimitado |
| Multimedia | Cloudflare R2 | Free | 10GB sin egress |
| Pagos | Wompi / MercadoPago | Sin cuota fija | ~2.65%+700 COP/tx |
| Notificaciones | Firebase Cloud Messaging | Free | Ilimitado |
| Hosting web/admin | Firebase Hosting | Spark (free) | 10GB |

> **Decisión:** NestJS se **mantiene** como backend. Se hosteará en Render.com (free tier). Ya compila y corre localmente con 0 errores.

---

## 3. FASES (ACTUALIZADO)

```
FASE 0 → Narrativa ✅
FASE 1 → Backend + DB (COMPLETADA ✅)
FASE 2 → QA, Deploy y Offline
  ├─ 2.1 Smoke Tests E2E ✅ (26/26 tests PASS)
  ├─ 2.2 Hosting Config ✅ (render.yaml + Dockerfile listos)
  ├─ 2.3 RLS Policies ✅ (supabase/rls_policies.sql escrito)
  ├─ 2.4 Health Endpoint ✅ (GET /health + cron config)
  └─ 2.5 Offline Caching ⏳ Pendiente
FASE 3 → Pruebas de campo ⏳
FASE 4 → Post-MVP / Monetización ⏳
```

---

## 4. INVENTARIO DE DOCUMENTOS (ACTUALIZADO)

| Prioridad | Archivo | Estado | Descripción |
|-----------|---------|--------|-------------|
| 0 | `CITY_QUEST_EXPLORER_STATUS_PHASE2.md` | ✅ **NUEVO** | Estado actual + plan Fase 2 detallado |
| 0 | `CITY-QUEST-EXPLORER_QA_LOG.md` | ✅ Activo | Historial de decisiones CEO/Arquitecto |
| 0 | `Documentos/REsumen Ejecutivo.md` | ✅ Canon | Visión ejecutiva + stack free-tier |
| 0 | `Documentos/deep-research-report.md` | ✅ Canon | Research de mercado y fases 01–11 |
| 1 | `City_Quest_Explorer_Story_Writing.md` | ✅ Canon | Framework narrativo |
| 1 | `City_Quest_Explorer_Escape_Room_Experiences.md` | ✅ Canon | Diseño de misiones y acertijos |
| 1 | `Game_Designer_Mission_Pack_City_Pilot_Cartagena.md` | ✅ Canon | Misiones M1–M10 con GPS/QR/score |
| 2 | `City_Quest_Explorer_Architecture_Principal.md` | ✅ Canon | Stack, APIs, bounded contexts |
| 2 | `City_Quest_Explorer_UX_Ui_Wireframes.md` | 🚧 En progreso | Flujos y pantallas móviles |
| 2 | `Todo.md` | ✅ Actualizado | Tareas técnicas con estado |
| 3 | `README_SUPABASE_SETUP.md` | ✅ Listo | Setup Supabase + Prisma |
| 3 | `TODO_SUPABASE_DB.md` | ✅ Completado | Checklist conexión Prisma |
| 4 | `CEO_Agen_Checklist.md` | 🚧 Pendiente actualizar | Backlog técnico GPS/QR/Teams |
| 4 | `City_Quest_Explorer_QA_Test_Plan.md` | 🚧 Planificado | Plan QA por áreas |
| 4 | `City_Quest_Explorer_DevOps_Deployment.md` | ⏳ Pendiente | CI/CD Render/Vercel/Neon |
| 5 | `City_Quest_Explorer_Tourism_Monetization.md` | ⏳ Post-MVP | Alianzas y franquicias |
| 5 | `City_Quest_Explorer_Growth_Hacking.md` | ⏳ Post-MVP | Campañas y viral loop |

---

## 5. MODELO DE DATOS (ACTUALIZADO)

### Tablas en Supabase (Prisma: 10 modelos)

```prisma
User            id, supabaseUserId?, email, passwordHash?, name, role, createdAt, updatedAt
City            id, name, slug, country, createdAt
Route           id, cityId, name, description, difficulty, distanceMeters, estimatedMinutes, createdAt
Checkpoint      id, routeId, name, description, latitude, longitude, orderIndex
QRCode          id, routeId, checkpointId, code, createdAt
Team            id, routeId, name, captainId, createdAt
TeamMember      id, teamId, userId, role, joinedAt, @@unique(teamId, userId)
GameSession     id, teamId, routeId, cityId, status, startedAt, finishedAt?, currentCheckpointId?, score, metadata?
SessionEvent    id, sessionId, eventType, eventData, occurredAt
Ranking         id, routeId, teamId, score, position, updatedAt
```

### Enums de eventos (SCORING MISSION PACK ✅)

```typescript
EventType:
  LOCATION_UPDATE     → GPS ping (no suma score)
  QR_SCANNED          → +15 pts ✅ (actualizado desde +5)
  CHECKPOINT_REACHED  → +10 pts
  SESSION_FINISHED    → +100 pts + status = COMPLETED + finishedAt
```

> **Nota:** Escala de puntuación **alineada** con el Mission Pack canónico. Decisión tomada.

### Reglas de idempotencia (IMPLEMENTADAS ✅)
- [x] El mismo QR válido escaneado 2 veces **no duplica score**.
- [x] El mismo CHECKPOINT_REACHED enviado 2 veces **no duplica score** (verifica `currentCheckpointId`).
- [x] `SESSION_FINISHED` solo aplica una vez. Si status ya es `COMPLETED`, rechaza el evento con error.

---

## 6. APIs — ENDPOINTS VERIFICADOS ✅

### Auth (Supabase maneja esto — endpoints NestJS legacy deshabilitados)
```http
# El móvil usa Supabase Auth directamente, no estos endpoints
POST /auth/login         → throws UnauthorizedException (legacy)
POST /auth/signup        → throws UnauthorizedException (legacy)
```

### Public endpoints (sin auth)
```http
GET  /cities                              → ✅ Lista ciudades (Cartagena)
GET  /cities/:cityId                      → ✅ Ciudad por ID
GET  /cities/:cityId/routes               → ✅ Rutas + checkpoints
GET  /routes/:routeId                     → ✅ Ruta por ID
GET  /games/sessions/:sessionId           → ✅ Estado sesión
GET  /games/teams/:teamId/sessions        → ✅ Sesiones del equipo
GET  /routes/:routeId/rankings            → ✅ Ranking por ruta
GET  /routes/:routeId/teams               → ✅ Equipos por ruta
GET  /api                                 → ✅ Swagger UI
```

### Protected endpoints (requieren JWT Bearer)
```http
GET  /users/me                            → ✅ Perfil usuario
PATCH /users/me                           → ✅ Actualizar perfil
POST /games/sessions                      → ✅ Crear sesión (modo equipo)
POST /games/solo/sessions                 → ✅ Crear sesión SOLO (crea Team automático)
POST /games/sessions/:id/events           → ✅ Registrar evento (QR/GPS/checkpoint/finish)
POST /routes/:routeId/rankings            → ✅ Crear/actualizar ranking
POST /routes/:routeId/teams               → ✅ Crear equipo
POST /cities                              → ✅ Crear ciudad (admin)
POST /cities/:cityId/routes               → ✅ Crear ruta (admin)
```

### Scoring implementado (games.service.ts)
```typescript
CHECKPOINT_REACHED → score += 10 + actualiza currentCheckpointId
QR_SCANNED         → score += 15
SESSION_FINISHED   → status = COMPLETED + finishedAt + score += 100
```

---

## 7. ARQUITECTURA FLUTTER (IMPLEMENTADO ✅)

### Estructura de carpetas
```
mobile/lib/
├── main.dart                    ← Supabase.initialize + ProviderScope
├── routes/app_router.dart       ← GoRouter: /login, /map, /mission/:id, /ranking, /profile
├── core/
│   ├── auth/                    ← AuthStateNotifier con Riverpod
│   └── network/                 ← Dio + interceptor JWT
└── features/
    ├── auth/                    ← LoginScreen (tabs login/registro) + AuthForm
    ├── map/                     ← MapScreen + geofencing GPS + 5 checkpoints
    ├── missions/                ← MissionsScreen + MissionDetailScreen + narrativa
    ├── qr/                      ← QrScreen + mobile_scanner + overlay temático
    ├── ranking/                 ← RankingScreen + RankingApi conectado a NestJS
    ├── session/                 ← SessionProvider conectado a NestJS
    └── profile/                 ← ProfileScreen + logout
```

### Estado de implementación Flutter
- [x] Estructura carpetas Clean Architecture
- [x] GoRouter con auth guard (public vs protected routes)
- [x] Login/Registro con Supabase Auth (directo, sin NestJS)
- [x] Auth guard con `_SupabaseAuthListenable`
- [x] MapScreen con OpenStreetMap + 5 checkpoints + GPS
- [x] QR Scanner con mobile_scanner + overlay temático
- [x] Geofencing (50m radio) + MissionsScreen + MissionDetailScreen
- [x] SessionProvider + RankingScreen conectados a NestJS
- [x] ProfileScreen con datos de usuario + logout
- [x] Tema dark-dorado global (El Manuscrito Prohibido)
- [x] Errores de Supabase traducidos al español
- [x] IDs sincronizados con seed de Supabase (UUIDs determinísticos)
- [ ] Modo offline parcial (cache local SQLite)
- [ ] Eliminar GpsScreen (redundante con MapScreen)

---

## 8. BACKLOG TÉCNICO MVP — ESTADO ACTUAL

### 8.1 Infraestructura / DB ✅
- [x] `prisma/schema.prisma` con 10 modelos: `User`, `City`, `Route`, `Checkpoint`, `QRCode`, `Team`, `TeamMember`, `GameSession`, `SessionEvent`, `Ranking`
- [x] Proyecto Supabase configurado con DATABASE_URL
- [x] `.env` con `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`
- [x] `mobile/.env` con credenciales Supabase para Flutter
- [x] `npm run prisma:generate` ejecutado exitosamente
- [x] Migraciones aplicadas a Supabase via `prisma db push`
- [x] Seed de datos piloto: Cartagena + ruta + 5 checkpoints + 5 QR codes
- [x] Backend responde en `localhost:3000/api` (Swagger)
- [ ] Configurar **RLS** en Supabase (aislamiento de equipos)
- [ ] Setup **Cloudflare R2** para multimedia de Isabella/ARIADNA
- [ ] Configurar cron job "Mantener Supabase Vivo"

### 8.2 Backend NestJS ✅
- [x] `npm run build` → exit code 0 (0 errores TypeScript)
- [x] `SupabaseJwtStrategy` verifica JWT de Supabase (sincroniza usuarios a tabla local)
- [x] Endpoints críticos verificados y respondiendo:
  - [x] `POST /games/solo/sessions` ✅
  - [x] `POST /games/sessions/:id/events` ✅
  - [x] `GET /routes/:routeId/rankings` ✅
  - [x] `GET /routes/:routeId/teams` ✅
  - [x] `GET /cities` ✅
  - [x] `GET /cities/:id/routes` ✅
- [x] Scoring Mission Pack: QR=+15, CHECKPOINT=+10, SESSION_FINISHED=+100
- [x] Idempotencia: QR/checkpoint duplicados no suman, COMPLETED rechaza eventos
- [x] Fix `supabase-user-sync.service.ts`: eliminado `passwordHash: undefined`

### 8.3 Flutter — Estado por paso ✅
- [x] **Paso 1** — Supabase inicializado, `.env`, dependencias
- [x] **Paso 2** — Auth Supabase directo (login, registro, logout)
- [x] **Paso 3** — Auth guard GoRouter (rutas protegidas)
- [x] **Paso 4** — MapScreen OpenStreetMap + checkpoints + GPS
- [x] **Paso 5** — QR Scanner temático + QrEventApi
- [x] **Paso 6** — Geofencing + MissionsScreen + MissionDetailScreen
- [x] **Paso 7** — SessionProvider + RankingScreen conectados a NestJS

### 8.4 QA Funcional mínimo (COMPLETADO ✅)
- [x] `GET /cities` — endpoint público responde ✅
- [x] `GET /cities/:id/routes` — 5 checkpoints con datos reales ✅
- [x] `GET /api` — Swagger UI 200 OK ✅
- [x] Endpoints protegidos devuelven 401 sin token ✅ (5 tests)
- [x] Smoke E2E completo: Login → Sesión → QR → Score → Ranking ✅ (26/26 tests PASAN)
- [x] Test idempotencia: QR duplicado validado ✅
- [x] Test SESSION_FINISHED duplicado rechazado ✅

---

## 9. MISIONES M1–M10 (CANON MECÁNICO)

| Misión | Ubicación | Dificultad | Duración | Validación |
|--------|-----------|------------|----------|------------|
| M1 | Muralla / Baluarte Santa Catalina | 7 | 10–15 min | QR + GPS |
| M2 | Plaza de la Aduana | 8 | 10–20 min | GPS + QR |
| M3 | Castillo San Felipe | 8 | 10–20 min | GPS + QR |
| M4 | La Popa (Convento/Mirador) | 9 | 10–20 min | GPS + QR |
| M5 | Tramo libre (tolerancia GPS) | 8 | 10–25 min | GPS múltiple + QR |
| M6 | Santo Domingo | 9 | 8–18 min | QR + GPS buffer |
| M7 | Calle de la Amargura | 7 | 10–20 min | GPS + secuencia QR |
| M8 | Bocagrande / Malecón | 8 | 10–25 min | GPS + QR retorno |
| M9 | Pastelillo | 9 | 12–25 min | QR + GPS anti-falso |
| M10 | Muelle de los Pegasos / Bahía | 9 | 15–30 min | QR final + GPS + `SESSION_FINISHED` |

**Nota:** Por ahora 5 checkpoints seed (M1-M5). Los 5 restantes se agregan vía API.

---

## 10. BLOQUEADORES (ACTUALIZADO)

| # | Bloqueador | Estado | Decisión/Resolución |
|---|-----------|--------|---------------------|
| 1 | **NestJS vs Supabase** | ✅ **Resuelto** | **Mantener NestJS.** Hostear en Render.com free tier. Backend ya compila y corre. |
| 2 | **DATABASE_URL** | ✅ **Resuelto** | Configurado: pooler de Supabase Postgres |
| 3 | **Escala de puntos** | ✅ **Resuelto** | Mission Pack canónico: QR=+15, CHECKPOINT=+10, Misión=+100 |
| 4 | **Notificación actores** | ⏳ Post-MVP | WhatsApp manual o FCM push |
| 5 | **Supabase inactividad** | ✅ **Resuelto** | Health endpoint `GET /health` creado. Falta configurar cron-job.org tras deploy |

---

## 11. DEFINITION OF DONE — MVP (PROGRESO)

- [x] `npm run build` → exit code 0 ✅
- [x] `npm test` → 26 tests E2E pasan ✅
- [ ] Flutter genera APK funcional con GPS + QR + caché offline
- [x] Smoke E2E completo: APIs verificadas (26/26 tests) ✅
- [x] Idempotencia implementada ✅
- [x] RLS policies escritas (pendiente ejecutar en Supabase) ✅
- [x] Health endpoint creado (GET /health) ✅
- [ ] Backend hosteado en Render/Fly.io
- [ ] Cron job "Mantener Supabase Vivo" activo
- [x] `Todo.md` actualizado ✅
- [x] `CITY-QUEST-EXPLORER_QA_LOG.md` con entrada de cierre ✅

---

## 12. PLAN DE CRECIMIENTO (POST-MVP — SIN CAMBIOS)

### Monetización inmediata (al lanzar)
- Alianzas con hoteles/hostales de Cartagena (comisión por referido)
- Paquete corporativo para team building
- Programa de referidos: 10% descuento por amigo referido

### Expansión narrativa
- 1 historia nueva por semana (costo interno ~50.000 COP/caja)
- Ciudades siguientes: Santa Marta → Barranquilla → Bogotá → Medellín

### Franquicias
- Manual de operaciones listo en `City_Quest_Explorer_Tourism_Monetization.md`
- Cuota inicial ~15M COP + royalty 8% sobre ventas netas

---

## 13. REGISTRO DE CAMBIOS

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-01 | Versión inicial — visión, MVP, arquitectura | CEO/Arquitecto |
| 2025-07 | Consolidación total en SOT único | CEO Agen |
| 2026-06 | Pasos 1–7 Flutter completados (Auth, Mapa, QR, Misiones, Ranking, Sesión) | Dev |
| 2026-06 | **Fase 1 COMPLETADA** — Schema restaurado, build 0 errores, DB migrada, seed cargado, scoring Mission Pack, idempotencia | Dev |
| 2026-06 | **Inicio Fase 2** — Smoke tests APIs OK, docs actualizados | Dev |
| 2026-06 | **Fase 2.1–2.4 completados** — Smoke E2E (26/26 tests), Health endpoint, RLS SQL, Hosting config, Todo/Master Plan actualizados | Buffy |

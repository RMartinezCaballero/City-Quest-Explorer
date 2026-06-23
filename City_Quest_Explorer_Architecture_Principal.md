# City_Quest_Explorer_Architecture_Principal - Arquitectura (NestJS/DDD/Event Driven)

Este archivo contiene la propuesta de arquitectura escalable para **City Quest Explorer**, con foco en una base simple primero y escalabilidad futura.

## 1) Arquitectura

### Propuesta (simple primero)
- Backend monolítico modular con **NestJS**.
- **PostgreSQL** como base de datos.
- Integración con Flutter (cliente móvil) y NextJS (landing/admin).
- **DDD** con límites de contexto claros.
- **Event Driven Design** dentro del monolito (event bus local), dejando ruta a broker externo.

### Estructura por capas
- **Presentation**: controllers / DTOs / auth guards / response mapping.
- **Application**: use cases, orquestación, validación de reglas.
- **Domain**:
  - entidades/aggregate roots
  - value objects
  - domain events (sin acoplarse a Prisma)
- **Infrastructure**:
  - repositorios (implementación Prisma)
  - integraciones (GPS provider, QR decoder si aplica)
  - bus de eventos (EventEmitter2 o similar)

### Módulos / bounded contexts propuestos
- **Auth & Users**
- **City & Routes**
- **Game & Session**
- **Teams**
- **Rankings & Scoring**
- **Content & QR**
- **Organizations (multi ciudad / SaaS futuro)**

### Diagrama (descriptivo)
- Clientes (Flutter, NextJS) → NestJS API → PostgreSQL
- Eventos internos:
  - `GameSessionCompleted`, `CheckpointReached`, `TeamJoined`
  - Event Bus(local) → Ranking updates / analytics / notificaciones

## 2) Base de datos (PostgreSQL + Prisma)

### Entidades/tables base (alto nivel)
- users
- organizations
- cities
- routes
- checkpoints
- qr_codes
- teams
- team_members
- game_sessions
- session_events
- rankings
- media

### Reglas de modelado
- Índices en campos consultados por gameplay:
  - `city_id`, `route_id`, `team_id`, `game_session_id`, `status`
- JSONB para `metadata`/campos flexibles.
- Eventos GPS/QR como “event stream”:
  - guardar discretamente en `session_events`
  - evitar persistir cada ping (estrategia de agrupado/decisión)

### Multi-ciudad / SaaS futuro
- Base: `organization_id` como partición lógica.
- Extensión: `tenant_id` opcional si se migra a SaaS formal.

## 3) APIs (propuesta)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/refresh` (si se requiere)

### Users
- `GET /users/me`
- `PATCH /users/me`

### Cities & Routes
- `GET /cities`
- `GET /cities/:cityId`
- `GET /cities/:cityId/routes`
- `GET /routes/:routeId`
- `POST /cities`
- `POST /cities/:cityId/routes`

### Game & Session (GPS/QR)
- `POST /game-sessions`
- `GET /game-sessions/:sessionId`
- `PATCH /game-sessions/:sessionId/location`
- `POST /game-sessions/:sessionId/scan-qr`
- `POST /game-sessions/:sessionId/checkpoint`
- `POST /game-sessions/:sessionId/finish`

### Teams
- `POST /teams`
- `GET /teams/:teamId`
- `POST /teams/:teamId/join`
- `PATCH /teams/:teamId`

### Rankings
- `GET /rankings/cities/:cityId`
- `GET /rankings/routes/:routeId`
- `GET /rankings/teams/:teamId`

### Content & QR
- `POST /checkpoints`
- `POST /qr-codes`
- `GET /qr-codes/:code/validate`

## 4) Riesgos técnicos
- Precisión GPS en entornos urbanos densos (necesidad de buffer/radio e idempotencia).
- Latencia/consistencia si múltiples miembros envían updates.
- Duplicación de eventos por reintentos de red.
- Crecimiento de `session_events` (volumen y estrategias de retención/agregación).
- Seguridad multi-tenant/organization en el futuro.

## 5) Recomendaciones
- Fase 1: monolito modular NestJS + PostgreSQL con Prisma.
- MVP primero: registro → creación de sesión → update GPS → validate QR/checkpoint → ranking básico.
- Elección de mapas con bajo coste (OpenStreetMap/Leaflet) para fase inicial.
- Swagger obligatorio y validación fuerte con DTOs.
- Eventos de dominio locales dentro del monolito; migración a broker cuando haya necesidad.
- Preparar `organization_id` desde el inicio para multi ciudad.

---

> Nota: este documento es el “Architecture log” equivalente para el rol de Arquitecto Principal.


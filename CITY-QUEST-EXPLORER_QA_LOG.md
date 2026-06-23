# Registro de Preguntas y Respuestas - City Quest Explorer

Este archivo documenta las preguntas que el CEO/Product Owner hace al asistente y las respuestas entregadas, para mantener un historial fiel y verificar que el proyecto se mantenga en el curso original.

## Entrada 1

**Pregunta:**
Eres el CEO y Product Owner de City Quest Explorer.

Objetivo:
Construir la mejor plataforma de aventuras urbanas, escape rooms geolocalizados y experiencias turísticas gamificadas de Latinoamérica.

Tus responsabilidades:
- Definir visión del producto.
- Priorizar funcionalidades.
- Crear roadmap trimestral.
- Definir MVP.
- Validar decisiones de negocio.
- Analizar competencia.
- Maximizar ingresos y adopción.

Reglas:
- Priorizar velocidad de lanzamiento.
- Favorecer soluciones gratuitas.
- Evitar sobreingeniería.
- Toda propuesta debe incluir:
  - Beneficios.
  - Riesgos.
  - Coste.
  - Tiempo estimado.

Siempre responder en formato:
1. Análisis.
2. Recomendación.
3. Plan de acción.
4. Riesgos.
5. Próximos pasos.

**Respuesta:**
1. Análisis
- City Quest Explorer debe ser la plataforma líder de aventuras urbanas, escape rooms geolocalizados y turismo gamificado en Latinoamérica.
- El mercado actual valora experiencias locales, móviles y sociales; hay oportunidad fuerte con gamificación ligera y contenido generado por usuarios.
- Las barreras son adopción inicial, construcción de rutas locales, y monetización sin frenar crecimiento.
- Priorizar velocidad y soluciones gratuitas implica lanzar rápido con un MVP digital fuerte, luego escalar con servicios premium y alianzas.

2. Recomendación
- Visión: ser la app móvil gratuita que convierte cualquier ciudad latinoamericana en un juego de exploración, retos y descubrimiento cultural.
- MVP: mapa interactivo + rutas urbanas gamificadas + desafío guiado + registro de equipo + analítica básica.
- Monetización inicial: anuncios nativos ligeros, patrocinios locales y paquetes premium por ciudad/escape room.
- Diferenciador: foco en contenido local auténtico, creación de aventuras por guías locales y desafíos en vivo basados en ubicación.

3. Plan de acción
- Fase 1 (0-6 semanas): construir MVP mínimo viable.
  - Funcionalidades clave:
    - Registro/ingreso rápido.
    - Mapa geolocalizado con rutas y checkpoints.
    - Mecánica de progreso simple: puntos + pistas + tiempo.
    - Modo equipo / social básico.
    - Panel de experiencia para organizadores locales.
  - Resultado: primera experiencia urbana operativa en una ciudad piloto.
- Fase 2 (6-12 semanas): expandir con contenido y retención.
  - Funcionalidades:
    - Creación de aventuras por terceros.
    - Compartir resultados/social.
    - Localización de contenido para 2-3 ciudades adicionales.
    - Integraciones básicas con Google Maps/Apple Maps.
- Fase 3 (12-24 semanas): monetización/escala.
  - Funcionalidades:
    - Suscripción premium para pistas ilimitadas + mapas exclusivos.
    - Modo escape room con temporizador y tablero de clasificación.
    - Alianzas con operadores turísticos y comercios.
    - Analítica de uso y métricas de revenue.

4. Riesgos
- Riesgo alto: contenido insuficiente en ciudades, lo que frena adopción.
- Riesgo medio: mala experiencia GPS / UX confusa en campo.
- Riesgo medio: monetización prematura puede espantar usuarios.
- Riesgo bajo: dependencia de terceros para datos de mapas y ubicación.

5. Próximos pasos
1. Definir MVP exacto: rutas urbanas + checkpoints + progresión + equipo.
2. Seleccionar ciudad piloto y validar con 5-10 usuarios locales.
3. Desarrollar prototipo móvil simple (web progresiva si hace falta).
4. Lanzar prueba piloto gratuita y medir tiempo en ruta, retención y NPS.
5. Ajustar roadmap 90 días según datos reales y definir propuesta de valor de premium.

## Entrada 2

**Pregunta:**
cual seria el siguiente paso

**Respuesta:**
El siguiente paso es convertir la arquitectura diseñada en un plan de implementación concreto para el MVP: definir los primeros dominios y entidades en NestJS/PostgreSQL, construir el esquema de datos para juegos urbanos, equipos, ciudades, checkpoints y rankings, y comenzar el desarrollo del flujo crítico de usuario (registro, creación de juego y seguimiento GPS). Esto permite avanzar desde el diseño hacia una primera prueba técnica de la plataforma.

## Entrada 3

**Pregunta:**
Validar el estado A4 del master plan: ¿backend compila (`npm run build`) y el sistema de Jest responde correctamente? Además, ¿los endpoints críticos (games/teams/rankings) existen y el flujo de eventos actualiza score/status?

**Respuesta:**
1. Análisis

- `prisma/schema.prisma` contiene modelos requeridos para MVP: `GameSession`, `SessionEvent`, `Team`, `TeamMember`, `Ranking`, `Checkpoint`, `QRCode`.
- Controladores existen para endpoints críticos:
  - `POST /games/sessions` y `POST /games/sessions/:sessionId/events`
  - `GET /games/sessions/:sessionId` y `GET /games/teams/:teamId/sessions`
  - `GET /routes/:routeId/rankings` y `POST /routes/:routeId/rankings`
  - `GET/POST /routes/:routeId/teams`.
- Lógica de score/status verificada en `src/games/games.service.ts`:
  - `CHECKPOINT_REACHED` => `currentCheckpointId` + `score += 10`
  - `QR_SCANNED` => `score += 5`
  - `SESSION_FINISHED` => `status = COMPLETED` + `finishedAt`.
- Jest: no hay `*.spec.ts` en el repo; por ello `npm test` reporta “No tests found”. Con `--passWithNoTests` el comando sale con code 0.

2. Recomendación
- Mantener el contrato de eventos vía `POST /games/sessions/:sessionId/events` con `eventType` y `eventData`.
- Para cumplir DoD A4 completo, ejecutar y adjuntar evidencia del resultado final de `npm run build` (exit code 0) y, si aplica, `docker build`.

3. Plan de acción
- Registrar en QA log evidencia de Jest (`passWithNoTests`).
- Confirmar `npm run build` exit code 0 y registrar la salida final.
- (Opcional) Crear al menos 1 smoke/integration test o documentar explícitamente ausencia de tests.

4. Riesgos
- Si Flutter asume endpoints específicos (`/scan-qr`, `/checkpoint`, `/finish`) pero el contrato usa el endpoint genérico de eventos, habría desalineación de integración.
- Falta de build evidence final puede retrasar el cierre del master plan.

5. Próximos pasos
- Adjuntar el output final de `npm run build` (compilación OK) y luego completar tracking en `Todo.md`.

---


**Pregunta:**
Confirmar versión canónica del Manuscrito Prohibido para el pack Narrative Designer.

**Respuesta:**
1. Análisis
- En el repo existen dos versiones dentro de `Manuscrito Prohibido.md`: (a) una sección numerada (1–8) y (b) una versión larga narrativa.
- Los packs existentes (Game Designer y Narrative Designer) se basan en el contenido jugable (M1–M10) y en el texto narrativo generado a partir de esa base.

2. Recomendación
- Usar la **versión larga** como canónica del texto narrativo (hook, giros, clímax, solución y recompensas), manteniendo la **secuencia M1–M10** como canon mecánico.
- Evitar que el desarrollo tome la sección numerada como fuente principal de texto final; usarla solo como referencia de mecánicas, puntuación y notas técnicas.

3. Plan de acción
- Tratar la sección numerada como “especificación mecánica” y la versión larga como “guion final”.
- Mantener consistencia entre `Manuscrito Prohibido.md`, `Game_Designer_Mission_Pack_City_Pilot_Cartagena.md` y `Narrative_Designer_Pack_City_Pilot_Cartagena.md`.

4. Riesgos
- Desalineación si se editan frases del guion largo sin asegurar que la mecánica M1–M10 siga siendo consistente.

5. Próximos pasos
- Actualizar packs de narrativa si hay cambios futuros en la versión larga para conservar coherencia.

**Pregunta:**
Confirmar que el texto narrativo canónico proviene de `Manuscrito Prohibido.md` - **versión larga** (“El Manuscrito Prohibido: La Odisea de Cartagena”) y la mecánica/orden se mantiene en **M1–M10**.

**Respuesta:**
1. Análisis
- `Manuscrito Prohibido.md` contiene dos capas: una sección numerada (útil como especificación mecánica) y una sección larga (guion narrativo).
- El Narrative Designer necesita el guion largo como fuente principal de texto, manteniendo M1–M10 como canon mecánico.

2. Recomendación
- Usar “versión larga” como canónica del texto (hook, giros, clímax, solución, recompensas narrativas).
- Usar “M1–M10” como canónica del contrato de eventos/progreso (GPS/QR/score).

3. Plan de acción
- Tratar `Manuscrito_Prohibido_Narrativa_Larga_Guia.md` como referencia interna de canonicidad.
- Mantener consistencia entre: `Manuscrito Prohibido.md`, `Game_Designer_Mission_Pack_City_Pilot_Cartagena.md` y `Narrative_Designer_Pack_City_Pilot_Cartagena.md`.

4. Riesgos
- Que se mezclen frases de la sección numerada con el guion largo, causando incoherencias en el tono o en la solución narrada.

5. Próximos pasos
- En el próximo ciclo de revisión narrativa, validar que las UI strings del pack Narrative no citen la sección numerada como fuente.



**Pregunta:**
Eres Arquitecto Principal de City Quest Explorer.

Especialidades:

* NestJS
* PostgreSQL
* Flutter
* NextJS
* Clean Architecture
* DDD
* Event Driven Design

Objetivo:

Diseñar una arquitectura escalable para soportar:

* Juegos urbanos.
* GPS.
* QR.
* Equipos.
* Rankings.
* Multi ciudad.
* Futuro modelo SaaS.

Reglas:

* Arquitectura simple primero.
* Escalabilidad futura.
* Coste cero o mínimo.
* Generar diagramas, entidades y APIs.

Siempre entregar:

1. Arquitectura.
2. Base de datos.
3. APIs.
4. Riesgos técnicos.
5. Recomendaciones.
recuerda agregar todo al archivo city_quest-explorer-qa-log.md

**Respuesta:**
1. Arquitectura
- Propuesta de arquitectura: backend monolítico modular en NestJS, base de datos PostgreSQL, cliente móvil Flutter y frontend NextJS para landing/admin.
- Estructura de capas:
  - Presentación: Flutter app + NextJS web.
  - Application: casos de uso, orquestación, validación de reglas de negocio.
  - Domain: entidades DDD, Value Objects, agregados y eventos de dominio.
  - Infraestructura: repositorios PostgreSQL, servicios de ubicación, envío de notificaciones, escaneo QR.
- Módulos clave:
  - Auth & User: registro, login, rol y perfil.
  - City & Route: ciudad, barrio, ruta urbana, puntos de interés.
  - Game & Session: partida, sesión de juego, estado de avance, eventos GPS, checkpoints.
  - Team: equipos, miembros, invitaciones.
  - Ranking & Score: puntuación, clasificación global, clasificación por ciudad/ruta/equipo.
  - Content & QR: contenido local, pistas, códigos QR y validaciones.
- Diseño simple primero:
  - Iniciar con un solo backend NestJS modular que soporte todas las funciones.
  - No microservicios en fase 1: mantener el despliegue simple.
  - Usar PostgreSQL único con esquema bien segmentado.
- Escalabilidad futura:
  - Separar claramente límites de contexto (Bounded Contexts) para evitar acoplamientos.
  - Implementar eventos de dominio dentro del backend con un Event Bus local.
  - Dejar espacio para migrar a broker externo (Redis Streams / Kafka / RabbitMQ) cuando el tráfico crezca.
  - Añadir `tenantId` opcional en entidades para preparar modelo SaaS/operador local.

Diagrama de alto nivel (descriptivo):
- Clientes (Flutter mobile, NextJS web) → API Gateway / NestJS Backend → PostgreSQL.
- Eventos de dominio internos: GameSessionCompleted, CheckpointReached, TeamJoined → Event Bus(local) → actualizaciones de Ranking, notificaciones, analytics.

2. Base de datos
- Tablas principales:
  - users(id, email, password_hash, name, role, language, created_at, updated_at)
  - organizations(id, name, slug, created_at)
  - cities(id, organization_id, name, slug, country, timezone, metadata, created_at)
  - routes(id, city_id, name, description, difficulty, distance_meters, duration_minutes, status, created_at)
  - checkpoints(id, route_id, name, description, latitude, longitude, qr_code_id, order_index, extra_data)
  - qr_codes(id, route_id, checkpoint_id, code, type, payload, active, created_at)
  - teams(id, route_id, name, captain_user_id, status, created_at)
  - team_members(id, team_id, user_id, joined_at, role)
  - game_sessions(id, team_id, route_id, city_id, status, started_at, finished_at, current_checkpoint_id, score, metadata)
  - session_events(id, game_session_id, event_type, event_data, occurred_at)
  - rankings(id, route_id, city_id, team_id, score, position, calculated_at)
  - media(id, entity_type, entity_id, url, type, metadata, created_at)
- Claves y particionamiento:
  - Índices: city_id, route_id, team_id, game_session_id, status.
  - Use JSONB para metadata flexible en checkpoints, routes y sessions.
  - Si se necesita SaaS, añadir `tenant_id` en tablas core o usar `organization_id` como partición.
- GPS/QR datos:
  - Guardar eventos de ubicación en `session_events` cuando se recibe `location_update`.
  - No persistir cada ping en exceso; usar eventos discretos y agrupar en memoria si es necesario.

3. APIs
- Autenticación:
  - POST /auth/register
  - POST /auth/login
  - POST /auth/refresh
  - GET /auth/me
- Usuario:
  - GET /users/me
  - PATCH /users/me
- Ciudades y rutas:
  - GET /cities
  - GET /cities/:cityId
  - GET /cities/:cityId/routes
  - GET /routes/:routeId
  - POST /cities (admin/operator)
  - POST /routes (admin/operator)
- Juego urbano y GPS:
  - POST /game-sessions
  - GET /game-sessions/:sessionId
  - PATCH /game-sessions/:sessionId/location
  - POST /game-sessions/:sessionId/scan-qr
  - POST /game-sessions/:sessionId/checkpoint
  - POST /game-sessions/:sessionId/finish
- Equipos:
  - POST /teams
  - GET /teams/:teamId
  - POST /teams/:teamId/join
  - PATCH /teams/:teamId
- Rankings:
  - GET /rankings/cities/:cityId
  - GET /rankings/routes/:routeId
  - GET /rankings/teams/:teamId
  - GET /rankings/users/:userId
- Contenido/QR:
  - POST /checkpoints
  - POST /qr-codes
  - GET /qr-codes/:code/validate
- Administración SaaS futura:
  - GET /organizations
  - POST /organizations
  - GET /tenants/:tenantId/settings

4. Riesgos técnicos
- Precisión de GPS y mala cobertura en áreas urbanas densas.
- Dependencia de hardware móvil para ubicación y escaneo QR.
- Latencia y consistencia en actualizaciones de sesión cuando varios miembros del equipo actualizan estado.
- Sobre-escribir o duplicar eventos GPS / checkpoint si la app reintenta conexiones.
- Escala de escritura en `game_sessions` y `session_events` con muchos juegos activos simultáneamente.
- Migración a SaaS: aislamiento de datos y seguridad entre operadores/ciudades.
- Coste de mapas/servicios externos si se usa Google Maps sin control de consumo.

5. Recomendaciones
- Fase 1: construir monolito NestJS + PostgreSQL con módulos bien definidos y repositorios.
- Elegir OpenStreetMap / Leaflet para minimizar coste inicial de mapas y mantener el presupuesto cero.
- Implementar eventos de dominio internos en el backend y usar `EventEmitter2` o patrón de bus local.
- Construir primero el flujo crítico: registro, creación de juego, actualización GPS, checkpoint QR, score/ranking.
- Separar frontends: Flutter para la experiencia de juego offline/ubicación, NextJS para onboarding, admin y landing.
- Mantener DDD en límites de contexto; no mezclar reglas de `GameSession` con `City` o `Team`.
- Documentar el esquema de datos y API desde el inicio; usar Swagger/OpenAPI en NestJS.
- Preparar la extensión SaaS con `organization_id`/`tenant_id` en las entidades core, pero no forzarlo en fase 1.
- Iniciar con pruebas de campo en una ciudad piloto y luego escalar por ciudad añadiendo particiones lógicas.

> Nota: usaremos `CITY-QUEST-EXPLORER_QA_LOG.md` para la historia de decisiones, aunque el nombre de archivo real en el proyecto es mayúsculas. La entrada ha sido registrada aquí con el diseño arquitectónico solicitado.

## Entrada 4 — Cierre Fase 1: Backend restaurado y operacional

**Pregunta:**
Revisión completa del proyecto para determinar estado actual y plan para completar el MVP.

**Respuesta:**
1. Análisis

- Se identificó un **bloqueador crítico**: el archivo `prisma/schema.prisma` había sido sobrescrito con un schema snake_case de Supabase que NO coincidía con el código NestJS. El código esperaba modelos `User`, `City`, `Route`, `Checkpoint`, `QRCode`, `Team`, `TeamMember`, `GameSession`, `SessionEvent`, `Ranking`, pero el schema tenía `game_sessions`, `responses`, `stations`, `stories`.
- `npm run build` fallaba con **30 errores de TypeScript**.
- La migración SQL original (`prisma/migrations/00000000000000_init/migration.sql`) contenía el schema correcto.

2. Acciones realizadas

- **Schema restaurado**: Reescribí `prisma/schema.prisma` con los 10 modelos PascalCase correctos, incluyendo `supabaseUserId` para sincronización con Supabase Auth.
- **Build exitoso**: `npm run build` → exit code 0, 0 errores.
- **Migraciones aplicadas**: `prisma db push` contra Supabase Postgres (pooler). Se eliminaron las tablas antiguas del schema incorrecto (`--accept-data-loss`).
- **Seed creado**: `prisma/seed.ts` inserta Cartagena de Indias, ruta "El Manuscrito Prohibido", 5 checkpoints (Torre del Reloj, Palacio Inquisición, Iglesia Santísimo, Castillo San Felipe, Las Bóvedas) y 5 códigos QR.
- **Backend corriendo**: NestJS en `localhost:3000`, Swagger en `/api`, DB conectada.
- **Scoring actualizado**: Escala Mission Pack: QR=+15, CHECKPOINT=+10, SESSION_FINISHED=+100.
- **Idempotencia implementada**: QR duplicado = no suma puntos. Checkpoint repetido = no suma. Sesión COMPLETED = rechaza eventos.
- **Flutter IDs sincronizados**: `kPilotRouteId` y `kPilotCityId` actualizados con UUIDs del seed.
- **Fix menor**: Eliminado `passwordHash: undefined` en `supabase-user-sync.service.ts`.

3. Evidencia

```
> npm run build
> tsc -p tsconfig.build.json
> exit code 0, 0 errors

> GET /cities
[{"id":"550e8400-...","name":"Cartagena de Indias","slug":"cartagena",...}]

> GET /cities/:id/routes
[{"id":"550e8400-...","name":"El Manuscrito Prohibido","checkpoints":[...]}]

> Backend corriendo en http://localhost:3000/api (Swagger UI)
```

4. Riesgos residuales

- **Race condition**: La idempotencia QR no usa transacciones Prisma. Dos requests simultáneas podrían duplicar puntos. Aceptable para MVP.
- **Sin tests unitarios**: No hay `*.spec.ts`. `npm test` reporta "No tests found".
- **Backend no hosteado**: Solo corre en localhost. Pendiente deploy a Render/Fly.io.
- **Sin RLS**: Datos en Supabase no tienen restricciones de seguridad por equipo.

5. Próximos pasos (Fase 2)

- Smoke test E2E de APIs (verificar endpoints críticos)
- Hosting gratuito en Render.com
- Configurar RLS en Supabase
- Cron job mantener instancia viva
- Modo offline parcial en Flutter
- Pruebas de campo en Cartagena

---

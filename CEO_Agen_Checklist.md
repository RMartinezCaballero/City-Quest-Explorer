# CEO Agen — Checklist paso a paso (GPS/QR/Teams/Rankings)

> Objetivo: organizar los MD existentes y dejar un plan claro y ejecutable para culminar el proceso del MVP.

---

## 0) Fuentes / MD relevantes (ya existen)
- **CITY-QUEST-EXPLORER_QA_LOG.md**: historial de decisiones (Entradas 1–3: visión/MVP/arquitectura).
- **Todo.md**: tareas técnicas con estado (Hecho/Por realizar).
- **City_Quest_Explorer_QA_Test_Plan.md**: plan QA por áreas (APIs/Flutter/NextJS/GPS/QR) y plantilla de casos.

---

## 1) Backlog técnico (MVP GPS/QR/Teams/Rankings)

### 1.1 Prisma / DB (Models)
- [ ] Confirmar que existen los modelos requeridos en `prisma/schema.prisma`:
  - [ ] `GameSession`
  - [ ] `SessionEvent`
  - [ ] `Team`, `TeamMember`
  - [ ] `Ranking`
  - [ ] `Checkpoint`, `QRCode`

**Evidencia esperada:** modelos en `schema.prisma` sin errores de generación Prisma.

### 1.2 Backend NestJS (Controllers + Services)
- [ ] Confirmar endpoints del flujo:
  - [ ] **Sessions**: crear/iniciar sesión (GameSession)
  - [ ] **Session events**: registrar eventos (LOCATION_UPDATE / QR_SCANNED / CHECKPOINT_REACHED / SESSION_FINISHED)
  - [ ] **Teams**: crear/elegir equipos
  - [ ] **Rankings**: listar ranking por ruta y crear/actualizar score

**Evidencia esperada:** controladores y servicios existen y compilan.

### 1.3 Correctitud de lógica (bloqueadores)
- [x] Aplicado fix de estabilidad en `src/games/games.service.ts`:
  - [x] Remover `as any` en update de `score`
  - [x] Mantener correcto el estado al finalizar (`SESSION_FINISHED` → `COMPLETED` + `finishedAt`)

- [ ] Validar que el comportamiento sea idempotente/consistente:
  - [ ] `CHECKPOINT_REACHED` actualiza `currentCheckpointId` y suma score correctamente
  - [ ] `QR_SCANNED` suma score correctamente
  - [ ] `SESSION_FINISHED` marca estado final una sola vez (o maneja reintentos)

**Evidencia esperada:** pruebas (unit/integration) o smoke manual.

---

## 2) Build / Test / QA (salida “lista para demo”)

### 2.1 Validación local (backend)
- [ ] Ejecutar:
  - [ ] `npm test`
  - [ ] `npm run build`

**Evidencia esperada:** exit code 0 y sin errores de TypeScript/Jest.

### 2.2 QA funcional mínimo (según City_Quest_Explorer_QA_Test_Plan.md)
- [ ] APIs
  - [ ] Registro/Login (JWT)
  - [ ] Endpoint protected devuelve 401 sin token
  - [ ] Create/Read de entidades base (teams/cities/routes)
  - [ ] GameSession: iniciar/actualizar/terminar
  - [ ] Ranking: cálculo/persistencia

- [ ] GPS
  - [ ] Coordenadas cercanas a checkpoint disparan evento
  - [ ] Retrasos de red no duplican progreso (idempotencia)

- [ ] QR
  - [ ] QR válido desbloquea checkpoint
  - [ ] QR inválido devuelve error claro
  - [ ] Duplicación por reintento no rompe sesión

**Evidencia esperada:** logs y resultados por caso.

---

## 3) End-to-End (flujo crítico)

### 3.1 Smoke E2E (ideal para validar en campo)
- [ ] Crear equipo (Teams)
- [ ] Iniciar sesión de juego (GameSession)
- [ ] Enviar evento LOCATION_UPDATE (GPS)
- [ ] Escanear QR (QR_SCANNED)
- [ ] Confirmar checkpoint alcanzado (CHECKPOINT_REACHED)
- [ ] Finalizar sesión (SESSION_FINISHED)
- [ ] Consultar ranking actualizado

**Criterio de salida:** un equipo logra progreso + score + ranking sin errores.

---

## 4) Checklist de documentación (para cerrar el proceso)
- [ ] Actualizar `Todo.md` marcando lo completado con `[x]`.
- [ ] Mantener `CITY-QUEST-EXPLORER_QA_LOG.md` coherente con lo implementado (si se cambió el alcance o lógica por bloqueadores, registrar entrada nueva).
- [ ] Si se agregan endpoints/DTOs, verificar Swagger:
  - [ ] decoradores `@Api*` en controladores/DTOs

---

## 5) Criterios de “Culminado” (Definition of Done)
- [ ] `npm run build` ✅
- [ ] `npm test` ✅ (o evidencia equivalente si no hay tests unitarios aún)
- [ ] Smoke E2E completado para GPS/QR + ranking
- [ ] QA mínimo documentado según `City_Quest_Explorer_QA_Test_Plan.md`
- [ ] `Todo.md` actualizado con estado real

---

## Registro rápido (estado actual)
- Fix realizado: `src/games/games.service.ts` (score update y finalización de sesión).



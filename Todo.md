# TODO — Estado actual y próximos pasos definitivos
## Último resumen de avance real

**Repo:** `master` → `origin/master`
**Admin deploy:** Vercel
**API deploy:** Render (`https://city-quest-explorer-api.onrender.com`)
**DB:** Supabase (`ylyajclxleqkfdpyregz`)
**Backend payments:** módulo implementado (`PaymentsModule`, controller, service y providers MP/Wompi)
**Último commit:** `7a9efc4` fix(admin): suspense wrapper for pago/exito and pago/fallo pages

### Lo ya verificado o cerrado
- [x] Backend compila: `npm run build`
- [x] Admin compila: `npm run build` verde, 21/21 páginas
- [x] Fix build admin: `/pago/exito` y `/pago/fallo` envueltos en `Suspense`
- [x] API health: `GET /health` ok y DB conectada
- [x] Swagger/docs: `GET /api` 200 OK
- [x] Endpoints públicos y rankings operativos
- [x] JWT + admin guard en rutas sensibles
- [x] Panel admin Next.js con páginas funcionales
- [x] Modelo enriquecido de `GameSession`, `GameSessionMission` y código de acceso
- [x] Backend pagos: modelo `Payment` en Prisma + endpoints (`create`, `webhook`, `status`, `user/:userId`)
- [x] Providers base para Mercado Pago y Wompi

### ⚠️ Pendiente de verificar manual
- [ ] Preview actual de admin en Vercel tras el push `7a9efc4`
- [ ] Verificar `/health` backend en producción desde tu entorno
- [ ] Verify checkout real end-to-end contra `/payments/*`

---

## Checklist cruzado: documentos vs código

### ✅ Documentación base
- [x] **FASE 01** — Biblia narrativa
- [x] **FASE 02** — Personajes y conspiración
- [x] **FASE 03** — Mapa de experiencia
- [x] **FASE 04** — Diseño jugable + manual operativo
- [x] **FASE 05** — Guiones y producción
- [x] **FASE 06** — Arquitectura app/backend
- [x] **FASE 07** — Manual de operaciones y franquicias
- [x] **FASE 10** — PRD completo
- [x] Narrative Designer Pack + Deep Research + Resumen Ejecutivo
- [x] `TODO_FLOW_PAGO.md` y `TODO_SUPABASE_DB.md` alineados

### ✅ Backend y base de datos
- [x] NestJS + Prisma levantados
- [x] Seed/ciudades/historias/rutas/misiones activo
- [x] Migraciones aplicadas en Supabase
- [x] Modelos core dominados: `Game`, `Story`, `Route`, `Mission`, `Checkpoint`, `QRCode`, `Challenge`, `Team`, `GameSession`, `Payment`, `Ranking`
- [x] Endpoints principales de juego y ranking operativos

### ✅ Panel admin
- [x] Sidebar sincronizada con rutas existentes
- [x] Páginas presentes: games-template, stories, routes, missions, qr-codes, users, teams, players, active-games, locations, notifications, stats
- [x] Flujos de verificación bulk y edición inline
- [x] Tipos de access code y misiones de sesión expuestos en API types

---

## Pendientes agrupados por prioridad

### 🔴 CRÍTICO — Cierre del MVP
- [ ] Verificar preview/estado del admin en Vercel post-push y corregir dominio/404 si aplica
- [ ] Cerrar testing E2E en producción:
  - [ ] Compra y código web
  - [ ] Login app
  - [ ] Primer viaje GPS + QR
  - [ ] Actores
  - [ ] Final y descarga de certificado

### 🟠 ALTA — Flujo de pago final
- [ ] Elegir proveedor único a producción: Wompi o MercadoPago
- [ ] Completar/limpiar providers a uno activo
- [ ] Ajustar URLs y vars de entorno según deploy real
- [ ] Validar webhook real y retornos `success/failure`
- [ ] UI checkout en admin

### 🟡 MEDIA — Operación y crecimiento
- [ ] Cierre de pruebas de campo en Cartagena
- [ ] Capacitación actores
- [ ] Activar referidos y pre-campaña narrativa
- [ ] Preparar soporte digital remoto

### 🟢 BAJA — Expansión y mantenimiento
- [ ] Ciudad #2
- [ ] Localización avanzada
- [ ] Manual de franquicias

---

## Orden recomendado
1. Verificar preview actual de admin en Vercel
2. Cierre E2E
3. Flujo de pago productivo
4. Pruebas de campo y operación piloto
5. Expansión

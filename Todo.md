# TODO — Estado actual del proyecto

## ✅ COMPLETADO — Motor Escape Room Narrativo Configurable

### Backend (NestJS + Prisma)
- [x] Prisma schema con entidades: Game, Story, Mission, Challenge, ChallengeAnswer, UnlockKey, StoryEnding
- [x] 6 módulos NestJS: games-template, stories, missions, challenges, unlock-keys, story-endings
- [x] Routes mejorado con soporte Story + backward compatibility
- [x] Seed actualizado con jerarquía completa (Cartagena → Manuscrito → 10 misiones → Challenge → 2 Finales)

### Admin Panel (NextJS)
- [x] Páginas admin: games-template list/detail, stories, routes, missions
- [x] Sidebar actualizado
- [x] api.ts con nuevos métodos

### Base de Datos
- [x] Migración Prisma formal creada (prisma/migrations/0001_add_escape_room_engine/)
- [x] RLS policies aplicadas en Supabase (40 statements, 0 errores)
- [x] Route.storyId corregido y restaurado a String requerido

### Deploy & CI/CD
- [x] Git push a GitHub (927b3ca)
- [x] Vercel deploy del admin panel ✅ (city-quest-admin.vercel.app)
- [x] Backend API en Render ✅ (city-quest-explorer-api.onrender.com)
- [x] Cron-job.org configurado (ping cada 30 min)

### Smoke Tests E2E
- [x] GET /health → status: ok, db: connected
- [x] GET /cities → Cartagena de Indias
- [x] GET /cities/:id/routes → Rutas con missions
- [x] GET /cities/:id/games → El Manuscrito Prohibido + 1 story
- [x] GET /api (Swagger) → 200 OK (Documentación API)
- [x] POST /routes/:id/rankings → 401 (requiere auth, esperado)
- [x] GET /routes/:id/rankings → Lista ordenada ✅

---

## 📋 URLs del proyecto

| Servicio | URL |
|----------|-----|
| Admin Panel (Vercel) | https://city-quest-admin.vercel.app |
| Backend API (Render) | https://city-quest-explorer-api.onrender.com |
| GitHub Repo | https://github.com/RMartinezCaballero/City-Quest-Explorer |
| Supabase Dashboard | https://supabase.com/dashboard/project/ylyajclxleqkfdpyregz |

---

## 📋 Post-MVP Pendientes (CEO_Agen_Master_Plan)

### Expansión
- [ ] Definir ciudad #2 (nombre + slug + datos base)
- [ ] Crear seed para ciudad #2
- [ ] Validar GPS en túneles (Castillo San Felipe)

### Flujo de Pago
- [ ] Elegir proveedor: Wompi o MercadoPago
- [ ] Modelo DB para transacciones/órdenes
- [ ] Endpoint para crear/consultar orden
- [ ] Webhook endpoint para confirmar pago
- [ ] UI de checkout en admin

### Testing
- [ ] Pruebas de campo en Cartagena
- [ ] Tests unitarios para nuevos módulos
- [ ] Offline caching en Flutter

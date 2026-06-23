# CITY QUEST EXPLORER — ESTADO Y PLAN FASE 2

> **Actualización:** Junio 2026 | Fase 1 COMPLETADA | Iniciando Fase 2

---

## 📊 RESUMEN FASE 1 — COMPLETADA ✅

### 🎯 Objetivo cumplido: Backend arreglado y operacional

| Componente | Estado Anterior | Estado Actual |
|---|---|---|
| Prisma Schema | ❌ Schema incorrecto (snake_case Supabase) | ✅ 10 modelos PascalCase correctos |
| npm run build | ❌ 30 errores TypeScript | ✅ 0 errores, exit code 0 |
| Base de Datos | ❌ Schema incorrecto en Supabase | ✅ Tablas correctas via `prisma db push` |
| Seed Data | ❌ No existía | ✅ Cartagena + ruta + 5 checkpoints + QR codes |
| Backend NestJS | ❌ No compilaba | ✅ Corriendo en localhost:3000 |
| Swagger | ❌ No disponible | ✅ Documentación en /api |
| Escala Puntuación | ❌ QR=+5 (vs canon +15) | ✅ QR=+15, CHECKPOINT=+10, Misión=+100 |
| Idempotencia | ❌ No implementada | ✅ QR duplicado no suma, checkpoint repetido no suma |
| Flutter IDs | ❌ Hardcodeados incorrectos | ✅ UUIDs sincronizados con seed |

### 📋 Cambios realizados

**Archivos modificados:**
- `prisma/schema.prisma` — Schema completo con 10 modelos
- `src/games/games.service.ts` — Scoring Mission Pack + idempotencia
- `src/auth/supabase-user-sync.service.ts` — Fix passwordHash
- `package.json` — Script `prisma:seed` agregado
- `mobile/lib/.../session_provider.dart` — IDs actualizados
- `mobile/lib/.../ranking_api.dart` — Route ID actualizado

**Archivos creados:**
- `prisma/seed.ts` — Seed Cartagena piloto

---

## 🗺️ PLAN FASE 2 — QA, Deploy y Preparación para Campo

### Prioridad: ALTA

```
FASE 2.1 → Smoke Test E2E de APIs
FASE 2.2 → Hosting gratuito del backend
FASE 2.3 → RLS en Supabase
FASE 2.4 → Cron job mantener vivo
FASE 2.5 → Offline caching en Flutter
```

---

### FASE 2.1 — Smoke Test E2E de APIs 🔥 (AHORA)

**Objetivo:** Verificar que el flujo completo funciona: Login Supabase → NestJS Session → Eventos → Ranking

| # | Test | Endpoint | Criterio |
|---|------|----------|----------|
| 1 | Obtener ciudades | `GET /cities` | Devuelve Cartagena ✅ |
| 2 | Obtener rutas | `GET /cities/:id/routes` | Devuelve ruta + 5 checkpoints |
| 3 | Crear ranking manual | `POST /routes/:id/rankings` | Ranking creado |
| 4 | Obtener ranking | `GET /routes/:id/rankings` | Lista ordenada |
| 5 | Endpoint protegido | `GET /cities` sin token | 401 Unauthorized |
| 6 | Swagger docs | `GET /api` | HTML Swagger UI |

### FASE 2.2 — Hosting Gratuito del Backend

**Opción recomendada:** Render.com (Plan Free)

| Servicio | Free Tier | Limitaciones |
|----------|-----------|--------------|
| **Render** | 750 horas/mes, 512MB RAM | Cold start ~30s en free |
| **Fly.io** | 3 VMs compartidas, 256MB | Necesita tarjeta para registro |
| **Railway** | $5 crédito/mes | Se acaba rápido |

**Pasos:**
1. Crear cuenta en Render.com
2. Conectar repo de GitHub
3. Configurar `DATABASE_URL` como variable de entorno (Supabase)
4. Deploy automático desde `main`

### FASE 2.3 — Row Level Security (RLS) en Supabase

**Reglas necesarias:**
- `game_sessions`: equipo solo ve sus propias sesiones
- `rankings`: todos ven el ranking (público)
- `users`: usuario solo ve su propio perfil

### FASE 2.4 — Cron Job "Mantener Supabase Vivo"

**Opción gratis:** Cron-job.org (plan free: 1 job cada 30 min)
- Hacer ping a `https://tu-app.onrender.com/api/health` o directamente a Supabase
- Frecuencia: cada 30 minutos (evita sleep a los 7 días)

### FASE 2.5 — Offline Caching en Flutter

**Implementación con flutter_cache_manager:**
- Cache de checkpoints y narrativa en SQLite local
- Cola de eventos pendientes (QR escaneados sin conexión)
- Sincronización automática al recuperar conexión
- Almacenar última sesión activa para continuar offline

---

## 📋 DEFINITION OF DONE — MVP

Para declarar el MVP "listo para campo":

- [x] `npm run build` → exit code 0 ✅
- [ ] `npm test` → tests unitarios básicos
- [ ] Flutter genera APK funcional con GPS + QR + caché offline
- [ ] Smoke E2E completo: APIs verificadas
- [ ] Idempotencia validada (implementada en backend)
- [ ] RLS configurado en Supabase
- [ ] Backend hosteado en Render/Fly.io
- [ ] Cron job "Mantener Supabase Vivo" activo
- [ ] `Todo.md` actualizado con estado real ✅
- [ ] `CITY-QUEST-EXPLORER_QA_LOG.md` con entrada de cierre de MVP

---

## 🚧 BLOQUEADORES RESUELTOS

Los 5 bloqueadores del Master Plan ahora tienen solución:

| # | Bloqueador | Estado | Solución |
|---|-----------|--------|----------|
| 1 | NestJS vs Supabase | ✅ Resuelto | **Mantener NestJS** + hostear en Render free |
| 2 | DATABASE_URL | ✅ Configurado | Supabase Postgres pooler |
| 3 | Escala de puntos | ✅ Resuelto | Mission Pack: QR=+15, GPS=+10, Misión=+100 |
| 4 | Notificación actores | ⏳ Post-MVP | WhatsApp manual o FCM push |
| 5 | Supabase inactividad | ⏳ Fase 2.4 | Cron job cada 30 min |

---

## 📈 PRÓXIMOS PASOS INMEDIATOS

1. ✅ ~~Fase 1 COMPLETADA~~ 
2. 🔥 **AHORA:** Smoke test E2E de APIs
3. Luego: Hosting, RLS, Cron, Offline
4. Final: Pruebas de campo en Cartagena

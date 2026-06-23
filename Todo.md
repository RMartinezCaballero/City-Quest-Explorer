# City Quest Explorer — Todo

> Última actualización: Junio 2026 | Sprint: Mobile MVP | **Fase 1 COMPLETADA**

---

## ✅ COMPLETADO

### Infraestructura
- [x] `.env` configurado con `DATABASE_URL` (Supabase Postgres)
- [x] `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET` en `.env`
- [x] `mobile/.env` con credenciales Supabase para Flutter
- [x] Prisma schema completo con 10 modelos: `User`, `City`, `Route`, `Checkpoint`, `QRCode`, `Team`, `TeamMember`, `GameSession`, `SessionEvent`, `Ranking`
- [x] Migraciones aplicadas a Supabase via `prisma db push`
- [x] Seed de datos piloto: Cartagena, ruta El Manuscrito Prohibido, 5 checkpoints, 5 QR codes
- [x] `npm run build` → exit code 0 (0 errores TypeScript)
- [x] Backend corriendo en `localhost:3000` con Swagger en `/api`
- [x] Backend conectado a Supabase Postgres via Prisma ✅

### Flutter — Auth (Paso 1, 2, 3)
- [x] `flutter_dotenv` + `mobile_scanner` agregados al `pubspec.yaml`
- [x] `Supabase.initialize()` en `main.dart` con variables de entorno
- [x] `AuthState` basado en `Session` de Supabase (fuente de verdad)
- [x] `AuthApi` usa `supabase.auth.signInWithPassword` y `signUp`
- [x] `AuthController` delega a Supabase, no a NestJS
- [x] Auth guard en GoRouter con `redirect` + `_SupabaseAuthListenable`
- [x] Memory leaks corregidos (StreamSubscription cancelado en dispose)
- [x] Errores de Supabase traducidos al español
- [x] Registro navega a `/map` si "Confirm email" está OFF

### Flutter — UI Auth
- [x] `LoginScreen` unificada con tabs (Iniciar sesión / Registrarse)
- [x] Diseño temático oscuro-dorado (El Manuscrito Prohibido)
- [x] Tema global `ThemeData` dark aplicado en `main.dart`
- [x] `ProfileScreen` con datos de usuario y botón de logout

### Flutter — Mapa (Paso 4)
- [x] `flutter_map` + `latlong2` + `geolocator` instalados
- [x] `MapScreen` con OpenStreetMap (costo cero)
- [x] 5 checkpoints piloto de Cartagena hardcodeados
- [x] Marcadores numerados con color según estado
- [x] Punto azul de ubicación del usuario
- [x] BottomSheet al tocar checkpoint con acceso al QR
- [x] FAB para refrescar ubicación
- [x] `userLocationProvider` con manejo de `LocationServiceDisabled`
- [x] `positionStreamProvider` con verificación de permisos
- [x] `userAgentPackageName` actualizado a `com.cityquest.explorer`

### Flutter — QR Scanner (Paso 5)
- [x] `QrScreen` con `mobile_scanner`
- [x] Overlay oscuro con ventana de escaneo y esquinas doradas
- [x] Botón de linterna
- [x] Panel de resultado éxito/error temático
- [x] `QrScanNotifier` con estados `idle → scanning → success/error`
- [x] `QrEventApi` para `POST /games/sessions/:id/events`
- [x] Offset hardcodeado eliminado del overlay

### Flutter — Misiones y Geofencing (Paso 6)
- [x] `geofenceProvider` con stream GPS continuo (50m de radio)
- [x] `MissionsScreen` con lista de checkpoints y banner de proximidad
- [x] `MissionDetailScreen` con narrativa real del Manuscrito Prohibido
- [x] Botón QR activo solo dentro del radio de geofencing
- [x] Ruta `/missions/:id` en GoRouter
- [x] Navegación entre mapa → misiones → detalle → QR

### Flutter — SessionProvider + RankingScreen (Paso 7)
- [x] `SessionProvider` conectado a NestJS `POST /games/solo/sessions`
- [x] Sesión solo (crea Team con 1 miembro automáticamente)
- [x] Banner de score activo en MapScreen
- [x] `RankingScreen` conectado a NestJS `GET /routes/:routeId/rankings`
- [x] Ranking en tiempo real con medallas para top 3
- [x] IDs de ruta/ciudad sincronizados con seed de Supabase

### Correcciones de calidad (Code Review)
- [x] Stream de auth cancelado en dispose
- [x] `_SupabaseAuthListenable` con dispose correcto
- [x] `AuthController` sincronizado con `authNotifier`
- [x] GPS sin crash por servicio desactivado
- [x] `ProfileScreen` con logout funcional

### Fase 1 — Backend Arreglado (NUEVO)
- [x] `prisma/schema.prisma` restaurado con 10 modelos PascalCase correctos
- [x] `npm run build` — 0 errores TypeScript
- [x] Migraciones aplicadas a Supabase via `prisma db push`
- [x] `prisma/seed.ts` — Seed de Cartagena: 1 ciudad, 1 ruta, 5 checkpoints, 5 QR codes
- [x] Backend corriendo, Swagger en `localhost:3000/api`
- [x] Escala de puntuación Mission Pack: QR=+15, CHECKPOINT=+10, Misión completa=+100
- [x] Idempotencia implementada: QR duplicado no suma, checkpoint repetido no suma, sesión COMPLETED rechaza eventos
- [x] `supabase-user-sync.service.ts` — Fix `passwordHash: undefined` eliminado
- [x] Flutter IDs actualizados: `kPilotRouteId` y `kPilotCityId` con UUIDs del seed

---

## 🔄 EN PROGRESO — Fase 2: QA, Deploy y Offline

Ver `CITY_QUEST_EXPLORER_STATUS_PHASE2.md` para el plan detallado.

---

## ⏳ PENDIENTE

### QA & Smoke Tests
- [ ] Smoke test E2E completo: Login → Mapa → Misión → QR → Score → Ranking
- [ ] Test endpoints protegidos devuelven 401 sin token
- [ ] Test idempotencia: mismo QR dos veces no duplica puntos
- [ ] Test SESSION_FINISHED: segunda llamada es rechazada

### DevOps / Deploy
- [ ] Investigar hosting gratuito para NestJS (Render / Fly.io)
- [ ] Configurar deploy del backend
- [ ] Configurar RLS en Supabase (aislamiento de equipos)
- [ ] Cron job "Mantener Supabase Vivo"
- [ ] Setup Cloudflare R2 para multimedia

### Flutter — Mejoras
- [ ] Modo offline parcial (cache local de misiones con flutter_cache_manager)
- [ ] Eliminar GpsScreen (redundante con MapScreen)
- [ ] Cache de checkpoints en SQLite local (isar/hive)
- [ ] Cola de eventos offline para sincronizar cuando haya conexión

### Post-MVP
- [ ] Panel de admin (NextJS)
- [ ] Notificación a actores freelance al iniciar sesión
- [ ] Flujo de pago (Wompi / MercadoPago)
- [ ] Expansión a segunda ciudad
- [ ] Validar GPS en túneles del Castillo San Felipe
- [ ] Pruebas de campo en Cartagena

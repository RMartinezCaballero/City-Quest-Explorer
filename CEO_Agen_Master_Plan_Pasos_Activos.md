# CEO Agen — Plan maestro organizado (pasos por ejecutar)

> Documento creado para **organizar lo que falta** y dejar una lista ejecutable.

---

## Fuente de verdad
- `CEO_Agen_Master_Plan.md`
- `Todo.md`
- `Todo.md` (bloque Post-MVP)

---

## Estado actual (resumen)
- MVP mobile + backend operativo.
- Supabase RLS **escritas** y **ejecutadas** (según `Todo.md`).
- Flujo de pago: **aún no iniciado**.

---

## Plan de ejecución (lo que falta)

### 1) Cron job para mantener vivo el servicio
**Objetivo:** asegurar disponibilidad usando `cron-job.org`.

**Tareas**
- [x] Configurar cron-job.org
  - [X] URL: `https://city-quest-explorer-api.onrender.com/health`
  - [X] Frecuencia: cada 30 minutos

**Evidencia/Done**
- [X] Verificar en cron-job que el endpoint responde 200 periódicamente.

---

### 2) Post-MVP — Expansión y QA de campo

#### 2.1 Expansión a segunda ciudad
- [ ] Definir ciudad #2 (nombre + slug + datos base)
- [ ] Crear seed para ciudad #2 (city/route/checkpoints/qrs)
- [ ] Probar `GET /cities` y `GET /cities/:cityId/routes`
- [ ] Actualizar Flutter para soportar listas dinámicas (si aplica)

**Done**
- [ ] Se ve la segunda ciudad completa en admin + móvil.

#### 2.2 Validar GPS en túneles (Castillo San Felipe)
- [ ] Definir rutas alternativas / tolerancias GPS para túneles
- [ ] Ajustar geofencing (buffer/radio/estrategia multi-ping)
- [ ] Re-test en campo (varias corridas)

**Done**
- [ ] Los checkpoints dentro del túnel se desbloquean consistentemente.

#### 2.3 Pruebas de campo en Cartagena
- [ ] Ejecutar lista de verificación de campo (GPS + QR + scoring + ranking)
- [ ] Registrar problemas y ajustar (tolerancia, overlays, mensajes)
- [ ] Capturar evidencia (logs + capturas + tiempos)

**Done**
- [ ] 1 experiencia completa sin bloqueos críticos (end-to-end).

---

### 3) Post-MVP — Flujo de pago (dejar para el último)

> Este bloque se ejecuta **al final**, después de QA de campo / expansión.

**Elegir proveedor**
- [ ] Decidir: **Wompi** o **MercadoPago**

**Backend (NestJS)**
- [ ] Modelo DB para transacciones/órdenes (tabla(s) de Payment/Order)
- [ ] Endpoint para crear orden
- [ ] Endpoint para consultar estado
- [ ] Webhook endpoint para confirmar pago (p. ej. APPROVED/PAID)
- [ ] Integrar con lógica de activación de sesión/compra

**Supabase / RLS**
- [ ] RLS para nuevas tablas de pagos/órdenes

**Frontend (Flutter/NextJS)**
- [ ] UI de checkout
- [ ] Manejo de estados: pending/approved/failed
- [ ] Manejo de reintentos

**Done**
- [ ] Pago se procesa con webhook y desbloquea/activa el producto esperado.

---

## Registro de cambios recomendado
- Actualizar `Todo.md` con `[x]` en cada ítem cuando se complete.
- Registrar decisiones en `CITY-QUEST-EXPLORER_QA_LOG.md` si cambia el alcance.


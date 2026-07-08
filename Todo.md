# TODO — Estado actual y próximos pasos definitivos
## Último resumen de avance real

**Repo:** `master` → `origin/master`  
**Admin deploy:** Vercel (`city-quest-admin.vercel.app`)  
**API deploy:** Render (`city-quest-explorer-api.onrender.com`)  
**DB:** Supabase (`ylyajclxleqkfdpyregz`)  
**Código vivo:** últimos commits `feat(admin-ui/backend): bulk verification, editable users/teams, solo/team mode, and admin pages`  
**Carpeta diseño/docs:** `/docs` no existe; la narrativa oficial vive en `documentos/`  
**Últimos cambios sin commit:** `admin/src/lib/api.ts` (+29 líneas)

### Lo ya verificado/build
- Swagger docs → `GET /api` 200 OK  
- Health → `GET /health` ok  
- Rankings públicos → listados ordenados  
- Admin pages habilitadas: users/teams/games/routes/qr-codes/players  
- Modo **solo** y **equipo** integrados en flujo de juego  
- Bulk verification de equipos/jugadores  
- Edición inline de users/teams desde panel admin  

### Cambios sin commitear / sucios
- `admin/src/lib/api.ts`: cambios locales no subidos aún; usar `git add -f admin/src/lib/api.ts` porque `.gitignore` excluye `admin/` en raíz.

---

## Checklist cruzado: documentos vs código

### ✅ REALIZADO: narrativa y diseño
- [x] **FASE 01 - Biblia narrativa** aprobada  
  Archivo: `documentos/FASE-01-BIBLIA-NARRATIVA.md`  
- [x] **FASE 02 - Personajes y conspiración** aprobada  
  Archivo: `documentos/FASE-02-PERSONAJES-Y-CONSPIRACION.md`  
- [x] **FASE 03 - Mapa de experiencia** aprobada  
  Archivo: `documentos/FASE-03-MAPA-DE-EXPERIENCIA.md`  
- [x] **FASE 04 - Diseño jugable** aprobada  
- [x] **FASE 04.5 - Manual operativo detallado** incluido en `documentos/FASE-04-DISENO-JUGABLE.md`  
- [x] **FASE 04 (maestro)** incluido en `documentos/Manuscrito_Detallado_Fase-4.md`  
- [x] **FASE 05 - Guiones y producción** aprobada  
  Archivo: `documentos/FASE-05-GUIONES-Y-PRODUCCION.md`  
  + variante: `documentos/fase 5 nnuevo.md`  
- [x] **FASE 06 - Arquitectura app/backend** aprobada  
  Archivo: `documentos/FASE-06-ARQUITECTURA-APP-Y-BACKEND.md`  
- [x] **FASE 07 - Manual de operaciones y franquicias** aprobada  
  Archivo: `documentos/FASE-07-MANUAL-DE-OPERACIONES-Y-FRANQUICIAS.md`  
- [x] **FASE 08 - Marketing y crecimiento** aprobada  
  Archivo: `documentos/FASE-08-MARKETING-LANZAMIENTO-Y-CRECIMIENTO.md`  
- [x] **FASE 09 - Plan financiero** aprobada  
  Archivo: `documentos/FASE-09-PLAN-FINANCIERO-Y-MODELO-DE-NEGOCIO.md`  
- [x] **FASE 10 - PRD completo** aprobada  
  Archivo: `documentos/FASE-10-PRD-COMPLETO-CITY-QUEST-EXPLORER.md`  
- [x] **Narrative Designer Pack** validado  
  Archivo: `documentos/Narrative_Designer_Pack_City_Pilot_Cartagena.md`  
- [x] **Guía canónica del manuscrito largo** definida  
  Archivo: `documentos/Manuscrito_Prohibido_Narrativa_Larga_Guia.md`  
- [x] **Deep research report** generado  
  Archivo: `documentos/deep-research-report.md`  
- [x] **Resumen ejecutivo** consolidado  
  Archivo: `documentos/REsumen Ejecutivo.md`  
- [x] **Fases nuevas** recopiladas  
  Archivo: `documentos/FASES NUEVAS.md`  

### ✅ REALIZADO: backend y base de datos
- [x] NestJS + Prisma levantados  
- [x] Seed de ciudades/historias/misiones creado  
- [x] Migraciones iniciales aplicadas en Supabase  
- [x] Endpoints de ciudades, routes, rankings operativos  
- [x] Validaciones con `class-validator` + decoradores Swagger  
- [x] JWT auth + admin guard en rutas sensibles  
- [x] QR codes dinámicos en panel admin  
- [x] Asignación de misiones desde routes list con regla first/last mission  
- [x] Selección de dificultad para recrear rutas  

### ✅ REALIZADO: admin panel
- [x] Sidebar sincronizada con páginas existentes  
- [x] Pages: games-template, stories, routes, missions, qr-codes, users, teams, players  
- [x] Profile/team model con modo solo/equipo  
- [x] Bulk verification UI y endpoints  
- [x] Edición inline de users y teams  
- [x] New admin pages añadidas  

### ⚠️ HECHO PERO POR COMMITEAR
- [ ] Hacer commit de cambios en `admin/src/lib/api.ts`
- [ ] Vuelve a desplegar preview en Vercel (`git push`) para refrescar `admin/`
- [ ] Re-verificar `/api` Swagger en deploy nuevo

---

## Pendientes agrupados por prioridad

### 🔴 CRÍTICO — Cierre del MVP
- [ ] Definir y ejecutar testing de campo en Cartagena
  Ref: `documentos/FASE-03-PRUEBAS-DE-CAMPO.md`
- [ ] Normalizar toda la narrativa bajo la **versión larga canónica**
  Ref: `documentos/Manuscrito_Prohibido_Narrativa_Larga_Guia.md`
- [ ] Cerrar data de misiones M1–M10 contra backend
  Ref: `Game_Designer_Mission_Pack_City_Pilot_Cartagena.md`
- [ ] Verificar offline caching en Flutter
  Ref: `mobile/README.md`
- [ ] Probar full stack end-to-end en producción:
  - [ ] Compra y código web
  - [ ] Login app
  - [ ] Primer viaje GPS+QR
  - [ ] Actores
  - [ ] Final y descarga de certificado

### 🟠 ALTA — Flujo de pago y negocio
- [ ] Elegir proveedor: Wompi o MercadoPago
- [ ] Modelo DB para transacciones/órdenes
- [ ] Endpoint crear/consultar orden
- [ ] Webhook endpoint
- [ ] UI checkout en admin
  Ref: `TODO_FLOW_PAGO.md`

### 🟡 MEDIA — Operación y crecimiento
- [ ] Capacitar actores mínimo 8h
  Ref: `documentos/FASE-07-MANUAL-DE-OPERACIONES-Y-FRANQUICIAS.md`
- [ ] Generar reels promocionales / postcréditos automáticos
  Ref: `documentos/FASE-05-GUIONES-Y-PRODUCCION.md`
- [ ] Montar soporte digital remoto
  Ref: `documentos/FASES NUEVAS.md`
- [ ] Preparar tsctest de mensajes GPS/Ariadna 15–20 audios
- [ ] Activar programa de referidos
- [ ] Lanzar pre-campaña “Isabella ha desaparecido”

### 🟢 BAJA — Expansión y mantenimiento
- [ ] Definir ciudad #2 (slug + seed)
- [ ] Extender tablas Prisma para nuevas ciudades
- [ ] Preparar manual de franquicias local
- [ ] Probar localización en túneles de San Felipe

---

## Sucesión lógica recomendada

1. Commit y redploy de cambios admin sin commitear  
2. Cierre del testing E2E en producción  
3. Flujo de pago  
4. Pruebas de campo  
5. Operación piloto  
6. Expansión a ciudades nuevas

---

## Reglas operativas del documento
- Si un paso ya pasó, marcar `[x]`
- Si suma código nuevo, anotar archivo y endpoint exacto
- Si usa un documento, agregar `Ref: ruta` para no perder trazabilidad
- Si queda bloqueado, usar `(blocked: motivo)`

# City_Quest_Explorer_QA_Test_Plan - QA Lead

Este archivo registra el **plan de QA** para City Quest Explorer para detectar errores antes de producción.

## Objetivo
Detectar errores antes de producción.

## Áreas a validar
- APIs
- Flutter
- NextJS
- GPS
- QR

## Entregables
- Casos de prueba
- Pruebas funcionales
- Pruebas de carga
- Reportes de bugs

## Estrategia QA (niveles)
1. Unit tests (lógica de dominio/validaciones)
2. Integration tests (API + DB + Auth JWT)
3. E2E / Smoke (flujos críticos: registro/login, iniciar misión, checkpoint, ranking)
4. Performance (carga y latencia)
5. Device/UX (GPS/QR con variaciones de hardware)

## Casos de prueba (plantilla)
Para cada caso:
- [ ] ID
- [ ] Feature (APIs / Flutter / NextJS / GPS / QR)
- [ ] Precondiciones
- [ ] Datos de prueba
- [ ] Pasos
- [ ] Resultado esperado
- [ ] Evidencia (logs / screenshots / video)
- [ ] Severidad (Blocker/High/Medium/Low)

## Pruebas funcionales (prioridad)
### APIs
- [ ] Registro/Login con JWT válido
- [ ] Endpoints protegidos responden 401 sin token
- [ ] CRUD de entidades base (users/cities/routes/teams)
- [ ] GameSession: iniciar/actualizar/terminar
- [ ] Ranking: cálculo y persistencia

### Flutter
- [ ] Navegación: rutas GoRouter (smoke)
- [ ] Autenticación: token y reintentos
- [ ] Manejo de estados: loading/empty/error
- [ ] Mapa: render rutas/checkpoints
- [ ] QR Scanner: parseo y validación
- [ ] GPS: tolerancia a precisión/latencia

### NextJS
- [ ] Login/roles (si aplica)
- [ ] Panel: CRUD y tablas sin fallos
- [ ] Gráficos: datos renderizados

### GPS
- [ ] Coordenadas cercanas a checkpoint disparan evento
- [ ] Retrasos de red no duplican progreso (idempotencia)
- [ ] Casos con GPS impreciso (buffer/radio)

### QR
- [ ] QR válido desbloquea checkpoint
- [ ] QR inválido devuelve mensaje claro
- [ ] Duplicación por reintento no rompe sesión
- [ ] Caducidad/estado “inactive” si aplica

## Pruebas de carga (Performance)
- [ ] Simular N sesiones concurrentes con eventos de ubicación
- [ ] Medir latencia P95 en endpoints de sesión/eventos
- [ ] Verificar que DB no colapse (índices y consultas)

> Nota: si no hay entorno de carga, definir un “benchmark” con herramientas del stack disponible.

## Reporte de bugs
Estructura sugerida:
- [ ] ID bug
- [ ] Área (API/Flutter/NextJS/GPS/QR)
- [ ] Severidad
- [ ] Pasos para reproducir
- [ ] Resultado real
- [ ] Resultado esperado
- [ ] Logs/stacktrace
- [ ] Estado (open/in progress/fixed)

## Estado del QA (tracking)
- [ ] Sprint QA plan creado
- [ ] Casos de prueba listos
- [ ] Funcional OK (por área)
- [ ] Performance OK (si aplica)
- [ ] Bugs críticos resueltos

---

> WA log equivalente para QA. Convención: `City_Quest_Explorer_*`.


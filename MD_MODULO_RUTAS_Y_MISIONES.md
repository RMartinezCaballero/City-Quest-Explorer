# Módulo Rutas y Misiones (Diseño + Pasos de Desarrollo)

> Documento: reestructurado con el criterio de diseño entregado (Fácil/Medio/Difícil) y con un plan paso a paso para implementarlo.

---

## 1) Objetivo del módulo
Diseñar el módulo **Rutas → Misiones → Enigmas/Retos → Respuestas → QR de verificación** para que:
- La app muestre rutas según **dificultad** (o un validador adicional).
- Cada ruta incluya **un conjunto de misiones** con cardinalidad y duración esperada:
  - **Fácil:** 5 a 8 misiones (~1 hora)
  - **Medio:** 8 a 10 misiones (~1 a 1:30 horas)
  - **Difícil:** 10 a 15 misiones (~hasta 2 horas)
- Los **enigmas/retos/respuestas** se asignen según la **dificultad seleccionada** por usuario/jugador.
- Cada misión tenga un **QR** que valida la respuesta en vez de depender solo de GPS.

---

## 2) Agregados y entidades (modelo conceptual)

### 2.1 Juego (Game) / Sesión (GameSession)
Ya existe en el backend (según el master plan):
- `GameSession`
- `SessionEvent` (events de gameplay)

### 2.2 Ruta (Route)
- Representa un recorrido físico dentro de una ciudad.
- Tiene atributo `difficulty` (Fácil/Medio/Difícil o nivel equivalente).
- Define el orden general de misiones (si se usa secuencia).

### 2.3 Misión (Mission)
Aunque hoy el repo usa `Checkpoint`/`QRCode` como verificación, este módulo necesita una capa lógica:
- Una **misión** corresponde a un objetivo jugable.
- Una misión contiene uno o más **retos/enigmas**.
- Una misión define:
  - `difficulty` (coincide o deriva de la ruta)
  - `estimatedMinutes`
  - contenido y prompts

### 2.4 Enigma/Retos (Challenge)
- Enunciado del reto + posible tipo (texto, opción múltiple, orden, etc.)
- **Respuestas** válidas (o regla de validación)
- **QR de verificación** (se puede materializar como `QRCode` asociado al checkpoint/misión)

### 2.5 Respuestas (Answer)
- Puede ser un string esperado, un set de strings, o un criterio.
- Para MVP conviene un “match exacto” normalizado + tolerancias.

---

## 3) Reglas de negocio (derivadas del requerimiento)

### 3.1 Regla de conteo/duración por dificultad
- La plataforma debe generar o seleccionar misiones con este rango:
  - Fácil → 5-8 misiones → ~60 min
  - Medio → 8-10 misiones → 60-90 min
  - Difícil → 10-15 misiones → hasta 120 min

**Implementación práctica:**
- En el seed/generador, se elige un “target” dentro del rango y se calcula duración aproximada por misión.

### 3.2 Asignación de retos según dificultad
- Cuando el usuario elige dificultad (Fácil/Medio/Difícil), los enigmas/retos se eligen con un filtro.
- Los retos pueden variar por:
  - dificultad
  - tipo de validación (QR)
  - categoría temática (si más adelante se quiere)

### 3.3 QR como verificador de respuesta
- Cada reto o misión debe tener un QR que:
  - al escanear, envía evento al backend
  - el backend valida que el QR sea el correcto para la misión y que la sesión no esté finalizada
  - si aplica, se marca respuesta como correcta (idempotente)

---

## 4) Adaptación a la estructura actual del repo (importante)
En el repo ya existen:
- `Checkpoint` (geolocalización y orden)
- `QRCode` (código asociado a checkpoints)

Por lo tanto, para no romper el MVP:
- **Checkpoint** puede funcionar como la “misión” en fase 1.
- **QRCode** puede funcionar como “verificador del reto/respuesta”.

En fase 2, si se requiere más precisión, se introduce una capa `Mission`/`Challenge` como modelo lógico adicional.

---

## 5) Diseño de API / flujo (propuesta)

### 5.1 Generación / asignación de misiones
**Opción A (simple para MVP):**
- Seed administra rutas con checkpoints ya asignados por dificultad.
- La app solo consulta `GET /cities/:cityId/routes/:routeId`.

**Opción B (dinámica):**
- Un endpoint genera misiones en runtime basadas en dificultad.
- Requiere persistencia (o snapshot) de la sesión.

Para velocidad, recomiendo **Opción A** primero.

### 5.2 Validación por QR
El backend ya tiene:
- `POST /games/sessions/:id/events` con `eventType` y `eventData`.

Plan para el QR:
- `QR_SCANNED`/o `CHECKPOINT_REACHED` ya suman score e idempotencia.
- Se extiende la validación para asegurar que el QR corresponde a la misión esperada (o checkpoint actual).

---

## 6) Pasos de desarrollo (uno a uno)

> Orden sugerido para desarrollo y verificación.

### Paso 1 — Normalizar el esquema de dificultad
- Definir el mapping de dificultad:
  - `Fácil` / `Medio` / `Difícil`
- Asegurar que `Route.difficulty` exista y sea consistente con el criterio.

**Done:** valores consistentes en seed y UI.

### Paso 2 — Definir el “contrato” de tamaño de ruta por dificultad
- Implementar una regla en seed/generador:
  - Fácil: 5-8 checkpoints/misiones
  - Medio: 8-10
  - Difícil: 10-15

**Done:** al crear una ruta con difficulty, se generan X misiones en ese rango.

### Paso 3 — Diseñar el formato de reto/enigma y su respuesta
- Definir entidad (aunque sea temporal) de:
  - enunciado
  - tipo
  - respuestas válidas (uno o varios)
- Definir qué se almacena en el QR:
  - O el `checkpointId` (y backend valida que el QR corresponde)
  - O un payload con `challengeId` (y backend valida la respuesta)

**Done:** estrategia clara para validación.

### Paso 4 — Conectar respuestas con QR
- Asegurar que `QRCode` tenga lo necesario para validar.
- Actualizar seed para que cada `QRCode` esté ligado a un reto/respuesta.

**Done:** seed produce rutas completas con QR verificables.

### Paso 5 — Validación idempotente (sin duplicar puntos)
- Confirmar comportamiento de backend:
  - el mismo QR no suma duplicado
  - checkpoint repetido no suma
  - sesión COMPLETED rechaza eventos

**Done:** pruebas/smoke para escenarios repetidos.

### Paso 6 — Integración con UI (Flutter)
- Si la UI actualmente lista misiones como checkpoints:
  - agrupar visualmente por dificultad
  - mostrar conteo y estimado de tiempo por dificultad
- Asegurar que el QR se habilita donde corresponde.

**Done:** flujo completo mapa → misiones → QR → scoring.

### Paso 7 — Admin/NextJS: control de dificultad y asignación
- Si el panel admin permite editar rutas:
  - agregar filtros por dificultad
  - permitir asignar checkpoints/misiones por rango

**Done:** admin puede crear una ruta con el set correcto.

### Paso 8 — Generador automático (opcional)
- Para “agregar o asignar automáticamente según dificultad”:
  - crear script generador o lógica en backend para seleccionar retos por difficulty.

**Done:** al crear ruta/dificultad, se auto-asignan misiones.

### Paso 9 — QA funcional + de campo
- Checklist:
  - GPS cerca desbloquea checkpoint (o tolerancia)
  - QR válido valida respuesta
  - idempotencia OK
  - ranking actualiza

**Done:** 1 experiencia de cada dificultad completada.

---

## 7) Entregables
- Seed actualizado con:
  - rutas por dificultad
  - misiones dentro del rango establecido
  - QR vinculados a validación
- Backend con validación QR consistente con session status.
- UI con tiempos y conteo por dificultad.
- Admin con capacidad de gestionar dificultad.

---

## 8) Notas para evitar retrabajo
- Empieza por “Checkpoint = Mission” si el MVP no tiene tabla `Mission`/`Challenge`.
- Introduce `Mission`/`Challenge` como modelo dedicado solo si necesitas:
  - múltiples checks por misión
  - tipos de reto más complejos
  - verificación distinta a “QR por checkpoint”


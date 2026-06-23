# Guía: Manuscrito Prohibido (versión larga) como canónica narrativa

## Propósito
Asegurar que el **texto narrativo final** usado por el equipo (Narrative Designer / Story UI / QA de narrativa) proviene de la **versión larga** de `Manuscrito Prohibido.md`.

## Regla de oro (canonicidad)
- **Canónica narrativa (texto):** sección **“El Manuscrito Prohibido: La Odisea de Cartagena”** (versión larga).
- **Canónica mecánica:** secuencia **M1–M10** (la mecánica/orden de misiones) se mantiene como referencia principal para progreso, eventos y validación.

## Cómo usarlo
- Narrative Designer: usar el guion largo para:
  - Hook global
  - Misterio central
  - Giros argumentales
  - Clímax y solución final
  - Recompensas narrativas
- Game Designer / backend:
  - Mantener M1–M10 como contrato de eventos (`LOCATION_UPDATE`, `QR_SCANNED`, `CHECKPOINT_REACHED`, `SESSION_FINISHED`).

## Frase de alineación (para QA/implementación)
> “La ciudad valida por capas: GPS confirma el cuerpo, QR confirma la mente, y el Manuscrito abre solo cuando el orden M1–M10 restauró el significado.”


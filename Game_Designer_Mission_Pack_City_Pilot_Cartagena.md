# Game Designer — Mission Pack (City Pilot Cartagena)

> Basado en: `Manuscrito Prohibido.md` + plantilla obligatoria de `City_Quest_Explorer_Escape_Room_Experiences.md`.
> 
> Alcance de diseño (decisiones):
> - Duración total del piloto: **45 min a 2 horas** (rango por el playtest; se reparte por M1–M10).
> - Dificultad global (QR/GPS): **7 a 9**.
> - Validación: **QR + GPS** (la solución siempre indica cómo se confirma en app).

---

## Modelo de juego (para consistencia)
- **Progreso**: misiones M1–M10 en orden.
- **Validación**: cada misión se confirma por **Solución** (QR y/o ubicación GPS).
- **Puntuación (alineada al Manuscrito)**:
  - Completar misión: **+100**
  - Pistas usadas/registradas: **+5** (opcional sin ayuda +10)
  - GPS válido: **+10**
  - QR válido: **+15**
  - Reintento QR inválido (por intento): **-2**

---

## Plantilla obligatoria por misión
**Narrativa**
**Objetivo**
**Dificultad**
**Duración**
**Solución**

---

## M1 — Juramento en la Muralla
- **Narrativa:**
  La piedra despierta cuando el equipo camina con intención. El Manuscrito no pide velocidad: pide atención.
- **Objetivo:**
  Iniciar la ruta y desbloquear el **Fragmento 1**.
- **Dificultad:** 7
- **Duración:** 10–15 min
- **Solución:**
  - Escanear **QR de Muralla** (QR válido → `QR_SCANNED`)
  - Estar dentro del área GPS de la **Muralla/Baluarte Santa Catalina** (GPS válido → `LOCATION_UPDATE`)

---

## M2 — La Aduana del Tiempo
- **Narrativa:**
  La Aduana guarda relojes invisibles; el Manuscrito traduce el tiempo a dirección.
- **Objetivo:**
  Registrar el rastro correcto (Fragmento 2).
- **Dificultad:** 8
- **Duración:** 10–20 min
- **Solución:**
  - GPS en **Plaza de la Aduana** dentro de buffer (evento GPS válido)
  - Escanear QR para confirmar lectura (evento QR válido)

---

## M3 — El Cálculo del Castillo
- **Narrativa:**
  En el Castillo la ciudad se alinea. La brújula emocional responde cuando la ubicación “encaja”.
- **Objetivo:**
  Validar orientación/cercanía para desbloquear Fragmento 3.
- **Dificultad:** 8
- **Duración:** 10–20 min
- **Solución:**
  - GPS cerca de **Castillo San Felipe / miradores** (evento GPS válido)
  - QR de verificación para cerrar la misión

---

## M4 — Viento de La Popa
- **Narrativa:**
  El viento es una pregunta. Si el equipo escucha el lugar, el QR ya conoce la respuesta.
- **Objetivo:**
  Interpretar el símbolo “parcial” y abrir Fragmento 4.
- **Dificultad:** 9
- **Duración:** 10–20 min
- **Solución:**
  - GPS en el área de **La Popa (Convento/Mirador)**
  - QR de símbolo parcial para completar la validación

---

## M5 — Sendero con Tolerancia
- **Narrativa:**
  La ruta perdona: la exactitud es un mito si el equipo mantiene su ritmo.
- **Objetivo:**
  Recorrer el tramo y registrar Fragmento 5.
- **Dificultad:** 8
- **Duración:** 10–25 min
- **Solución:**
  - Varias `LOCATION_UPDATE` hasta lograr GPS válido (sin duplicar score por reintentos del mismo checkpoint)
  - QR final del tramo

---

## M6 — Santo Domingo: Cifrado de Piedra
- **Narrativa:**
  La piedra guarda letras que no gritan. El Manuscrito te da el índice, no la frase.
- **Objetivo:**
  Descifrar/confirmar con el QR el Fragmento 6.
- **Dificultad:** 9
- **Duración:** 8–18 min
- **Solución:**
  - Escanear **QR de Santo Domingo**
  - Confirmar llegada con GPS aproximado (buffer GPS válido)

---

## M7 — Calle de la Amargura: Observación
- **Narrativa:**
  No es una pista: son señales. El equipo debe notar lo que la ciudad intenta ocultar.
- **Objetivo:**
  Desbloquear Fragmento 7 por observación (3 micropistas).
- **Dificultad:** 7
- **Duración:** 10–20 min
- **Solución:**
  - GPS en zona de **Calle de la Amargura / Centro Histórico** (GPS válido)
  - Secuencia de 3 QR o 1 QR con “índice” (según configuración del checkpoint)

---

## M8 — Bocagrande: Registro del Regreso
- **Narrativa:**
  El regreso escribe el verdadero mapa. El tiempo ordena el ciclo cuando vuelves.
- **Objetivo:**
  Registrar consistencia y abrir Fragmento 8.
- **Dificultad:** 8
- **Duración:** 10–25 min
- **Solución:**
  - GPS en **Bocagrande/malecón**
  - QR de confirmación de retorno

---

## M9 — Pastelillo: Peligro Controlado
- **Narrativa:**
  La amenaza es un examen de calma. La ciudad evalúa decisiones, no prisa.
- **Objetivo:**
  Completar el Fragmento 9.
- **Dificultad:** 9
- **Duración:** 12–25 min
- **Solución:**
  - QR contextual (resolver/confirmar con QR válido)
  - GPS válido para evitar falsos positivos

---

## M10 — Muelle de los Pegasos: Capítulo Final
- **Narrativa:**
  Juntar los diez no es terminar: es volver legible el camino que el Manuscrito te pidió.
- **Objetivo:**
  Revelar el Manuscrito y activar cierre (Fragmento 10 + recompensa final).
- **Dificultad:** 9
- **Duración:** 15–30 min
- **Solución:**
  - Escanear QR de capítulo final
  - GPS válido en el área del **Muelle de los Pegasos / Bahía**
  - Evento final: `SESSION_FINISHED`

---

## Distribución de duración total (45 min–2 horas)
Aproximación por misión:
- M1–M2: 20–35 min
- M3–M5: 25–60 min
- M6–M8: 28–70 min
- M9–M10: 27–60 min

> El rango total depende del tiempo de walking, cobertura GPS y latencia de QR.

---

## Reglas explícitas (para que el Backend/Flutter sea consistente)
- Un checkpoint/misión se considera completado cuando se cumplen las condiciones de **Solución**.
- Reintentos:
  - Si el QR inválido se reintenta: penalización (según Manuscrito).
  - Si se reintenta el mismo QR válido / llegar nuevamente a la misma zona: **no duplicar score** (idempotencia esperada para City Pilot).

---

## Checklist de documentación (por misión)
- [x] Narrativa
- [x] Objetivo
- [x] Dificultad
- [x] Duración (rango)
- [x] Solución (QR + GPS)


# FASE 3 — PRUEBAS DE CAMPO
## City Quest Explorer: El Manuscrito Prohibido

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Ciudad:** Cartagena de Indias  
**Estado:** ⏳ Pendiente de ejecución

---

## 1. OBJETIVO

Validar que la experiencia completa de **El Manuscrito Prohibido** funciona correctamente en un entorno real: GPS, escaneo QR, puntuación, ranking y narrativa en las calles de Cartagena.

---

## 2. PRERREQUISITOS

### 2.1 Técnicos

| Requisito | Estado | Instrucciones |
|-----------|--------|---------------|
| Backend en Render | ✅ Vivo | `https://city-quest-explorer-api.onrender.com/health` → 200 |
| Supabase DB | ✅ Conectada | 10 checkpoints cargados (M1-M10) |
| RLS Policies | ✅ Ejecutadas | Políticas activas en Supabase |
| APK de Flutter | ⏳ Pendiente | Ver sección **2.2** |
| Cron job keep-alive | ⏳ Pendiente | Ver sección **2.3** |

### 2.2 Generar APK

En una máquina con **Java JDK 11+** y **Flutter 3.44+** instalados:

```bash
cd mobile
flutter clean
flutter pub get
flutter build apk --debug
```

El APK se generará en:
```
mobile/build/app/outputs/flutter-apk/app-debug.apk
```

> **Alternativa:** Ejecutar `flutter run` con un dispositivo Android conectado por USB.

### 2.3 Configurar Cron Job (Mantener Backend Vivo)

Render.com duerme el servicio free tier después de 15 min de inactividad.

1. Crear cuenta gratis en [cron-job.org](https://cron-job.org)
2. Crear un job con:
   - **URL:** `https://city-quest-explorer-api.onrender.com/health`
   - **Frecuencia:** Cada 30 minutos
   - **Método:** GET
3. Activar el job

---

## 3. PLAN DE PRUEBAS — 10 MISIONES (M1–M10)

### 3.1 Checkpoints GPS y QR

| # | Misión | Ubicación | Coordenadas | Validación |
|---|--------|-----------|-------------|------------|
| **M1** | Juramento en la Muralla | Baluarte Santa Catalina | 10.4236, -75.5532 | QR + GPS |
| **M2** | La Aduana del Tiempo | Plaza de la Aduana | 10.4225, -75.5501 | QR + GPS |
| **M3** | El Cálculo del Castillo | Castillo San Felipe | 10.4231, -75.5403 | QR + GPS |
| **M4** | Viento de La Popa | La Popa (Mirador) | 10.4210, -75.5340 | QR + GPS |
| **M5** | Sendero con Tolerancia | Camellón de los Mártires | 10.4245, -75.5470 | GPS múltiple + QR |
| **M6** | Cifrado de Piedra | Getsemaní | 10.4247, -75.5525 | QR + GPS |
| **M7** | Observación | Calle de la Amargura | 10.4253, -75.5495 | GPS + QR |
| **M8** | Registro del Regreso | Bocagrande | 10.4080, -75.5550 | GPS + QR |
| **M9** | Peligro Controlado | Pastelillo | 10.4150, -75.5480 | QR + GPS |
| **M10** | Capítulo Final | Muelle de los Pegasos | 10.4200, -75.5430 | QR + GPS + `SESSION_FINISHED` |

### 3.2 Códigos QR para pruebas

Cada checkpoint tiene un QR code generado automáticamente con el formato:
```
CQE-MP-{NN}-CARTAGENA
```

| Checkpoint | Código QR |
|------------|-----------|
| M1 | `CQE-MP-01-CARTAGENA` |
| M2 | `CQE-MP-02-CARTAGENA` |
| M3 | `CQE-MP-03-CARTAGENA` |
| M4 | `CQE-MP-04-CARTAGENA` |
| M5 | `CQE-MP-05-CARTAGENA` |
| M6 | `CQE-MP-06-CARTAGENA` |
| M7 | `CQE-MP-07-CARTAGENA` |
| M8 | `CQE-MP-08-CARTAGENA` |
| M9 | `CQE-MP-09-CARTAGENA` |
| M10 | `CQE-MP-10-CARTAGENA` |

> **IMPORTANTE:** Para las pruebas, generar códigos QR con estos valores usando cualquier generador QR online (ej. qr-code-generator.com).

---

## 4. FLUJO DE PRUEBA

### 4.1 Preparación (5 min)

1. Verificar que el backend responde: `GET https://city-quest-explorer-api.onrender.com/health`
2. Verificar checkpoints: `GET https://city-quest-explorer-api.onrender.com/cities/550e8400-e29b-41d4-a716-446655440001/routes/550e8400-e29b-41d4-a716-446655440010`
3. Instalar APK en dispositivo Android
4. Tener los 10 códigos QR impresos o en otro dispositivo

### 4.2 Ejecución (45–120 min)

| Paso | Acción | Criterio de éxito |
|------|--------|-------------------|
| 1 | Abrir app → ver Login Screen | ✅ Pantalla con tabs "Iniciar sesión" y "Registrarse" |
| 2 | Registrarse con email y contraseña | ✅ Redirige al mapa |
| 3 | Ver mapa con 10 marcadores | ✅ Checkpoints visibles en OpenStreetMap |
| 4 | Activar GPS | ✅ Punto azul muestra ubicación actual |
| 5 | Tocar un marcador | ✅ BottomSheet con info del checkpoint + botón QR |
| 6 | Ir a ubicación física + escanear QR | ✅ Score se actualiza (+15 por QR, +10 por GPS) |
| 7 | Ir a pantalla de Misiones | ✅ Lista de 10 misiones con progreso |
| 8 | Abrir detalle de misión | ✅ Narrativa visible, botón QR activo |
| 9 | Ir a Ranking | ✅ Tabla de posiciones |
| 10 | Cerrar sesión → Profile → Logout | ✅ Vuelve a Login |

### 4.3 Puntuación esperada

| Evento | Puntos |
|--------|--------|
| QR escaneado | +15 |
| Checkpoint alcanzado (GPS) | +10 |
| Misión completada (`SESSION_FINISHED`) | +100 |
| **Total por misión** | **+125** |
| **Total 10 misiones** | **+1250** |

---

## 5. CASOS DE PRUEBA

### 5.1 Autenticación

| TC | Descripción | Resultado esperado | ✅ / ❌ |
|----|-------------|-------------------|---------|
| TC-01 | Registrar usuario nuevo | Redirige al mapa, sesión activa | |
| TC-02 | Iniciar sesión con usuario existente | Redirige al mapa | |
| TC-03 | Iniciar sesión con credenciales incorrectas | Mensaje de error en español | |
| TC-04 | Cerrar sesión | Vuelve a Login, no puede acceder al mapa | |

### 5.2 Mapa y GPS

| TC | Descripción | Resultado esperado | ✅ / ❌ |
|----|-------------|-------------------|---------|
| TC-05 | Mapa carga con 10 checkpoints | 10 marcadores numerados visibles | |
| TC-06 | GPS muestra ubicación actual | Punto azul en la posición real | |
| TC-07 | Tocar marcador de checkpoint | BottomSheet con nombre, descripción y botón QR | |
| TC-08 | Acercarse a ubicación real (50m) | Banner de proximidad aparece | |

### 5.3 QR Scanner

| TC | Descripción | Resultado esperado | ✅ / ❌ |
|----|-------------|-------------------|---------|
| TC-09 | Escanear QR válido | "+15 puntos" + feedback de éxito | |
| TC-10 | Escanear mismo QR dos veces | No duplica puntos (idempotencia) | |
| TC-11 | Escanear QR inválido | Mensaje de error | |

### 5.4 Sesión y Puntuación

| TC | Descripción | Resultado esperado | ✅ / ❌ |
|----|-------------|-------------------|---------|
| TC-12 | Score se actualiza en banner del mapa | Score visible y actualizado | |
| TC-13 | Finalizar sesión | Status = COMPLETED, +100 pts | |
| TC-14 | Evento SESSION_FINISHED duplicado | Rechazado (404) | |

### 5.5 Ranking

| TC | Descripción | Resultado esperado | ✅ / ❌ |
|----|-------------|-------------------|---------|
| TC-15 | Ranking muestra equipos/usuarios | Lista ordenada por score | |
| TC-16 | Top 3 muestra medallas | 🥇🥈🥉 visibles | |

---

## 6. REGISTRO DE INCIDENCIAS

| # | Fecha | Hora | Checkpoint | Dispositivo | Problema | Severidad | Resuelto |
|---|-------|------|------------|-------------|----------|-----------|----------|
| | | | | | | | |

**Severidad:** 🔴 Crítico / 🟡 Medio / 🟢 Leve

---

## 7. CRITERIOS DE ÉXITO

La Fase 3 se considera **completada** cuando:

- [ ] **TC-01 a TC-16** pasan en al menos 2 dispositivos diferentes
- [ ] El flujo completo (registro → mapa → 10 checkpoints → ranking → logout) funciona sin errores
- [ ] La idempotencia funciona: escanear el mismo QR dos veces no duplica puntos
- [ ] El GPS detecta correctamente la proximidad a los checkpoints (radio 50m)
- [ ] El score final coincide con el esperado (QR + GPS + finalización)

---

## 8. RECURSOS

- **Backend:** https://city-quest-explorer-api.onrender.com
- **Swagger API Docs:** https://city-quest-explorer-api.onrender.com/api
- **Health Check:** https://city-quest-explorer-api.onrender.com/health
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ylyajclxleqkfdpyregz
- **Repositorio:** `D:\Projects\City Quest Explorer`

---

## 9. PRÓXIMOS PASOS (POST-PRUEBAS)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🔴 Alta | Corregir bugs encontrados | Según registro de incidencias |
| 🟡 Media | Añadir más checkpoints | Expandir a las rutas A/B completas |
| 🟡 Media | Contenido multimedia | Subir videos/audios de Isabella y ARIADNA a R2 |
| 🟢 Baja | Panel de administración | Web para crear sesiones, ver datos |
| 🟢 Baja | Sistema de pagos | Integrar Wompi / MercadoPago |
| 🟢 Baja | Expansión a nuevas ciudades | Santa Marta, Barranquilla, Bogotá |

---

*Documento generado para Fase 3 — Pruebas de Campo de City Quest Explorer*

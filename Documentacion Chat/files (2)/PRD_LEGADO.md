---
title: "LEGADO"
subtitle: "PRD Maestro — Plataforma gastronómica de la Costa Caribe colombiana con raíces árabes"
author: "Roberto — Fundador"
date: "Julio 2026"
---

# 0. Resumen ejecutivo

**LEGADO** es una plataforma gastronómica (app móvil + web) dedicada a la cocina tradicional de la Costa Caribe colombiana y su profunda herencia árabe (siria-libanesa). No es una app de recetas más: es un archivo vivo de memoria familiar, historia de inmigración y técnica culinaria, narrado por dos personajes propios — **Abuela Tula** (la voz de la tradición) y **Tío Roberto** (el guía cultural que lleva al usuario por las rutas, los sitios y las historias detrás de cada plato) — y potenciado por IA en cada capa del producto. El nombre **LEGADO** es la promesa central de marca: cada receta que se guarda es un legado familiar que no se pierde.

- **Nombre recomendado:** LEGADO (app y libro)
- **Personajes narradores:** Abuela Tula y Tío Roberto
- **Tagline:** *"Las recetas auténticas de la Costa Colombiana con raíces árabes."*
- **Nivel de ambición:** Producto listo para inversión Seed/Serie A — arquitectura escalable, IA nativa, documentación completa de producto.
- **Inversión inicial declarada:** USD 0 (bootstrap) → el PRD y la arquitectura están diseñados para crecer por fases sin requerir capital inicial grande.
- **Diferenciador central:** ningún competidor (Cookpad, Kitchenstories, apps de recetas colombianas) combina (1) enfoque hiper-específico en la fusión costeño-árabe, (2) narrativa con personajes propios y storytelling histórico con fuentes, (3) IA integrada en todo el flujo — desde generación de recetas hasta reconocimiento de plato por foto — y (4) un modelo de negocio con marketplace y cursos, no solo suscripción.

## 0.1 Nota sobre alcance de este documento
Un PRD físico de 200–300 páginas no es una unidad de trabajo útil: se vuelve obsoleto antes de usarse. En su lugar, este paquete entrega la misma profundidad de decisión repartida en documentos vivos y accionables:

1. **`PRD_AbuelaTula.pdf`** (este documento) — visión, producto, funcionalidades, monetización, KPIs.
2. **`Arquitectura_Tecnica.pdf`** — stack, modelo de datos, APIs, seguridad, infraestructura.
3. **`Roadmap_Backlog.pdf`** — fases, épicas, historias de usuario priorizadas.
4. **`/agentes`** — prompts maestros del orquestador y de cada agente especializado, listos para instalar en Claude Code.
5. **Logos** — 3 conceptos de marca en SVG/PNG.

---

# 1. Nombre y marca

| Opción | Evaluación |
|---|---|
| **LEGADO** ⭐ recomendado | Directo, emotivo, funciona igual en español e inglés, resume el objetivo de homenaje sin depender de un solo personaje, escalable a otros formatos (Libro LEGADO, Ruta LEGADO, Certificado LEGADO) |
| Sabores del Caribe | Genérico, más difícil de defender como marca (muchos usan "Sabores de...") |
| Costa & Cedro | Elegante y simbólico (cedro = árbol emblema del Líbano), buen nombre para línea premium/editorial, pero menos cálido para app de consumo masivo |

**Recomendación:** usar **LEGADO** como marca principal y de producto (app, libro, certificados), con **Abuela Tula** y **Tío Roberto** como los personajes narradores que le dan voz y calidez al contenido, y **"Costa & Cedro"** como sello editorial interno para contenido histórico/premium (cursos, ediciones especiales) — así se reutilizan las tres ideas originales sin fragmentar la marca.

**Personajes canónicos (confirmado por el fundador):**
- **Abuela Tula** — narradora principal, voz de las recetas y la cocina de memoria familiar.
- **Tío Roberto** — anfitrión de las rutas gastronómicas, eventos e historia de la inmigración árabe (homenaje directo al fundador).
- *(Reservados para fases futuras, mencionados en el brief original):* Don Farid, Chef Karim — posibles personajes secundarios para historia árabe y técnica de chef, a evaluar en Fase 2.

---

# 2. Objetivo del producto

Todo junto, con un orden de prioridad claro para no diluir el producto:

1. **Núcleo (Fase 1):** App de recetas premium con historia, IA y modo cocina — "el libro de recetas de la abuela, digital e inteligente."
2. **Capa 2 (Fase 2):** Comunidad — usuarios suben recetas, siguen chefs, retos, gamificación.
3. **Capa 3 (Fase 3):** Escuela — cursos, certificados, marketplace de ingredientes/utensilios.
4. **Visión a 3 años:** la referencia editorial y educativa de la cocina costeño-árabe — "la Wikipedia + Netflix + escuela" de este nicho específico, con autoridad histórica citable.

---

# 3. Público objetivo

Enfoque principal: **familias y personas con conexión emocional a la cocina costeña y/o árabe-libanesa**, con expansión progresiva.

**Personas prioritarias (Fase 1):**
- Familias costeñas cocinando en casa (público ancla, "enfocado en los familiares" según el fundador).
- Colombianos de la costa viviendo fuera del país (nostalgia, conexión cultural).
- Descendientes de comunidad árabe-colombiana buscando preservar recetas familiares.

**Personas secundarias (Fase 2–3):**
- Turistas gastronómicos y extranjeros interesados en cocina fusión.
- Estudiantes de cocina / escuelas culinarias.
- Chefs, restaurantes y hoteles (contenido B2B, licenciamiento de contenido).
- Influencers gastronómicos (embajadores de marca).

---

# 4. Idiomas y plataformas

- **Idiomas:** español (principal) + inglés desde el lanzamiento. Árabe queda como Fase 3 (alto valor simbólico, pero bajo volumen de usuarios iniciales; se evalúa según tracción con diáspora árabe-colombiana).
- **Plataformas:** Android, iOS, Web (React Native + Next.js comparten lógica y diseño). Tablet se resuelve con diseño responsivo del mismo app. Smart TV se evalúa en Fase 3 si el contenido en video crece (modo "cocina en la sala").

---

# 5. Cuentas y acceso

- Registro con **Google, Apple y Facebook** (social login) + correo como respaldo.
- **Modo invitado** habilitado para navegar recetas gratuitas sin fricción — crítico para adquisición orgánica (SEO/compartidos en redes).
- Recetas premium, modo cocina avanzado y descargas en PDF requieren cuenta.

---

# 6. Contenido: origen y curaduría

- **Recetas fundacionales:** producidas por el fundador (base editorial propia, con autoridad y voz consistente).
- **Contribuciones de usuarios:** habilitadas desde el lanzamiento, con **publicación semanal curada** ("receta de la semana de la comunidad") en vez de flujo abierto masivo — protege la calidad mientras el catálogo base crece.
- **Aprobación:** el **administrador** aprueba en Fase 1. La IA se usa como **pre-filtro** (revisa formato, coherencia de ingredientes, detecta contenido inapropiado) antes de pasar a revisión humana — no aprueba de forma autónoma todavía. Fase 2 evalúa moderación híbrida IA + moderadores comunitarios.

---

# 7. Inteligencia artificial — capacidades del producto

La IA vive **en el backend** (no expuesta como "chatbot genérico"), integrada en flujos específicos:

| Capacidad | Fase | Descripción |
|---|---|---|
| Generación y mejora de recetas | 1 | Asistir al equipo editorial a redactar/estandarizar recetas desde notas o borradores |
| Conversión de porciones | 1 | Recalcular ingredientes según comensales |
| Sustitución de ingredientes | 1 | Alternativas por disponibilidad, alergias o dieta |
| Adaptaciones (vegetariano, sin gluten) | 1 | Variante generada y marcada como "sugerencia IA", nunca reemplaza la receta original |
| Cálculo nutricional | 1 | Calorías y macros estimados por porción |
| Lista de compras automática | 1 | Generada desde receta o menú semanal |
| Menú semanal | 2 | Combina recetas guardadas + preferencias |
| Recomendaciones personalizadas | 2 | Basadas en historial, favoritos, temporada |
| Chef IA conversacional (voz de Abuela Tula / Tío Roberto, dentro de LEGADO) | 2 | "¿Qué puedo cocinar con lo que tengo?" |
| Reconocimiento de plato por foto | 2 | Sube una foto → la IA identifica el plato y sugiere la receta equivalente |
| Generación de imágenes hiperrealistas | 2 | Fotografía de apoyo para recetas sin foto profesional aún |
| OCR de recetas manuscritas antiguas | 2 | Digitalizar cuadernos familiares de recetas |
| Reconocimiento de voz | 2 | Búsqueda y navegación por comandos de voz en Modo Cocina |
| Libro LEGADO (libro automático personalizado) | 2 | La IA compila un PDF/ePub con las recetas favoritas del usuario |
| Árbol genealógico de recetas | 3 | Visualización de cómo una receta evolucionó (ciudad, familia, generación) |
| Investigación histórica asistida | Continuo | La IA ayuda a estructurar investigación, **sin citar fuentes automáticamente** (decisión del fundador: la validación de fuentes queda en manos del equipo editorial/historiador para evitar alucinaciones históricas) |

> **Nota de escaneo de refrigerador ("¿qué hay en mi nevera?"):** descartado explícitamente por el fundador (Fase N/A). Se reemplaza por un flujo más simple y confiable: el usuario **escribe o dicta** los ingredientes que tiene, y la IA recomienda recetas — mismo beneficio, sin depender de visión artificial poco confiable sobre refrigeradores reales.

---

# 8. Contenido de cada receta (ficha estándar)

Cada receta en LEGADO incluye, como mínimo:

- Nombre + nombre en árabe/transliteración cuando aplique (ej. Kibbeh / كبة)
- Historia y origen (párrafo narrado por Abuela Tula o Tío Roberto)
- Ciudad/región de origen + ubicación en mapa
- Influencia árabe explicada (qué técnica/ingrediente viene de esa tradición)
- Tiempo de preparación, porciones, costo estimado, dificultad
- Ingredientes con conversión de unidades y sustituciones IA
- Pasos con temporizadores integrados (Modo Cocina)
- Valor nutricional estimado + alertas de alergias comunes
- Foto y/o video
- Narración en audio (voz de Abuela Tula)
- Historia del ingrediente clave (ej. "por qué usamos alcaparras")
- Calificación de la comunidad (estrellas) y comentarios

---

# 9. Mapas y rutas gastronómicas

- **Mapa interactivo:** cada receta georreferenciada a su ciudad de origen.
- **Rutas gastronómicas** por ciudad: Cartagena, Barranquilla, Lorica, Mompox, Sincelejo, Santa Marta, La Guajira — ampliable.
- **Cartagena como piloto**, reutilizando la investigación histórica y las **10 ubicaciones reales** ya documentadas en el trabajo narrativo previo del fundador (*El Manuscrito Prohibido*) como base de contenido cultural/histórico verificado — mismo rigor de investigación, aplicado ahora a gastronomía en vez de ficción.
- Fase 3: integración de "experiencias" reales — visitas guiadas, participaciones en sitios, alianzas con restaurantes locales (mencionado por el fundador como línea de eventos/experiencias).

---

# 10. Historias, línea de tiempo y storytelling

- Artículos narrativos tipo "La historia del Kibbeh", "La llegada de los libaneses a la Costa", "Por qué existe el arroz con almendras" — contenido editorial ancla para SEO y diferenciación.
- **Línea de tiempo** (1850 → actualidad) presente pero **no obligatoria** de completar por el usuario — es contenido de descubrimiento, no un requisito de onboarding.
- Fase 3: **árbol genealógico de recetas**, mostrando variantes por familia/generación/ciudad.

---

# 11. Modo Cocina

- Pantalla siempre activa (evita que el celular se bloquee mientras se cocina).
- Ingredientes y pasos leídos por voz.
- Avance automático de paso a paso.
- Temporizadores integrados por paso.
- Fase 1: calificación de receta al finalizar. Fase 2: retos ("cocina esta receta y comparte tu foto").
- Realidad aumentada (ver el plato en 3D) queda como **Fase 3 — exploratorio**, sujeto a validar demanda real antes de invertir en su desarrollo (alto costo, beneficio incierto en early stage).

---

# 12. Gamificación y comunidad

- Insignias, niveles, logros, retos (ej. "30 días cocinando costeño") y ranking — **el fundador delega el diseño detallado al equipo de producto/growth** ("sorpréndeme"); propuesta:
  - Niveles temáticos: *Aprendiz de Abuela Tula → Cocinero de Barrio → Guardián de la Receta → Maestro del Sabor.*
  - Insignias por región (ej. "Ruta de Cartagena completada") y por técnica (ej. "Domina el Kibbeh").
  - Ranking mensual por ciudad, para generar competencia sana y sentido de pertenencia local.
- Comunidad: comentarios, likes, fotos, videos, seguir chefs/usuarios — Fase 2.
- Podcast: Fase 2–3, formato corto narrado por Tío Roberto (historias + una receta por episodio).

---

# 13. Cursos, certificados y escuela

- Cursos en video (Fase 2), con **Certificado LEGADO** digital al finalizar (marca LEGADO / sello Costa & Cedro).
- Roles de contenido: Chef instructor, Historiador, Nutricionista — ya contemplados en el modelo de roles (sección 17).

---

# 14. Eventos

- Calendario de eventos temáticos: Festival del Frito, Festival del Dulce, Semana Santa, Navidad, Ramadán.
- Fase 3: **experiencias físicas** — visitas a sitios, participaciones presenciales, transmisión de la experiencia dentro de la app (fotos/video), alineado con la idea del fundador de mostrar "participaciones o visitas a sitios."

---

# 15. Monetización

**Modelo:** Freemium con múltiples líneas de ingreso, sin publicidad (descartada explícitamente).

| Plan | Incluye |
|---|---|
| **Gratis** | Catálogo base de recetas, modo cocina básico, comunidad, mapa |
| **Premium** | Descargas en PDF, Libro LEGADO personalizado, recetas exclusivas, sin límites de guardado, cursos con descuento |
| **Chef / Escuela / Restaurante** *(Fase 3, B2B)* | Licenciamiento de contenido, marca blanca para escuelas de cocina, herramientas de menú para restaurantes |

**Líneas de ingreso adicionales:**
- Marketplace (especias, utensilios, libros, ingredientes, cursos) — vía **afiliados** (Amazon, Mercado Libre, tiendas locales) en Fase 1–2 antes de operar inventario propio.
- Cursos y certificados (Fase 2).
- Pasarelas de pago: **Wompi** (mercado local colombiano), **Google Pay** y **Apple Pay** para fricción mínima en móvil. Stripe/PayPal quedan disponibles para expansión internacional futura (diáspora/EE.UU.).

**Publicidad:** descartada por decisión explícita del fundador — mantiene la experiencia premium y evita saturar contenido familiar/nostálgico con anuncios.

---

# 16. Modo sin conexión y descargas

- **Modo offline:** recetas guardadas/favoritas disponibles sin internet (crítico para cocinar en cocina sin buena señal, o para viajeros).
- **Descargas:** PDF disponible para plan Premium. ePub/libro físico bajo demanda quedan como extensión de la misma función en Fase 2–3.
- **Libro LEGADO:** la IA compila el recetario personal del usuario (sus favoritas + notas) en un PDF con identidad visual de marca — funcionalidad Premium insignia del producto, pensada literalmente como "el legado familiar en PDF", heredable y compartible entre generaciones.

---

# 17. Panel administrativo y roles

**Panel completo tipo CMS** desde el lanzamiento (justificado porque el fundador ya opera con equipo editorial propio y contenido semanal).

Roles del sistema:
- **Administrador** — control total, aprobación final.
- **Editor** — redacción y curaduría de recetas.
- **Chef** — validación técnica de recetas y cursos.
- **Historiador** — investigación y validación de contenido histórico/cultural.
- **Nutricionista** — validación de datos nutricionales y alertas de alergias.
- **Fotógrafo** — gestión de contenido visual.
- **Moderador** — comunidad (comentarios, contenido de usuarios).
- **Usuario** — consumo, contribución y comunidad.

---

# 18. Analítica

Métricas de producto desde el día uno:
- Recetas más vistas / más cocinadas (vs. solo vistas — diferencia clave de calidad de engagement).
- Tiempo activo en Modo Cocina.
- Ingredientes más usados/buscados.
- Ciudades/rutas más populares.
- Retención por cohortes (D1/D7/D30), conversión Free→Premium, LTV, CAC.
- Herramienta: **PostHog** (producto + embudos + feature flags en una sola herramienta, ideal para equipo pequeño).

---

# 19. API pública

El fundador pidió opciones — aquí tres niveles, recomendando empezar por el primero:

1. **Fase 1 (recomendado):** API interna únicamente, consumida por la propia app. Cero riesgo, cero soporte externo que mantener.
2. **Fase 2:** API de solo lectura para partners específicos (ej. una escuela de cocina que quiera mostrar el catálogo) — acceso por API key, sin auto-registro público.
3. **Fase 3 (si hay tracción):** API pública documentada (estilo Spoonacular/Edamam) como línea de ingreso B2B — licenciamiento de datos gastronómicos e históricos a otras apps, medios o investigadores. Aquí es donde el catálogo curado y con fuentes históricas se vuelve un activo de datos único y monetizable.

---

# 20. Stack tecnológico (resumen — detalle en Arquitectura_Tecnica.pdf)

Confirmando y adoptando la propuesta técnica del fundador, coherente con sus proyectos anteriores (LAJAM, TLVMB):

- **Frontend web:** React + Next.js + TypeScript
- **Mobile:** React Native (Android/iOS, un solo código)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions + Row Level Security)
- **IA:** OpenAI + NVIDIA NIM + Kimi (según tarea) orquestados desde Edge Functions
- **Búsqueda semántica:** pgvector + RAG (para "qué puedo cocinar con...", recomendaciones, buscador narrativo)
- **Hosting:** Vercel
- **Pagos:** Wompi + Google Pay + Apple Pay
- **Analítica:** PostHog
- **Notificaciones:** Firebase Cloud Messaging
- **Almacenamiento multimedia:** Supabase Storage

---

# 21. Nivel de calidad del producto

Confirmado **Nivel 4**: producto de nivel startup para inversión, con arquitectura escalable, IA integrada y documentación completa. Esto no significa construir todo de una vez — significa que **cada pieza que se construye en Fase 1 ya está diseñada para escalar**, sin necesidad de reescritura cuando llegue tracción o inversión.

---

# 22. Roadmap por fases (resumen — detalle en Roadmap_Backlog.pdf)

| Fase | Duración estimada | Foco |
|---|---|---|
| **Fase 0 — Fundacional** | 4–6 semanas | Marca, arquitectura, modelo de datos, 30–50 recetas fundacionales cargadas, panel admin básico |
| **Fase 1 — MVP público** | 8–10 semanas | App móvil + web, Modo Cocina, IA core (porciones, sustituciones, nutrición, lista de compras), mapa, cuentas, Premium con PDF/Libro LEGADO |
| **Fase 2 — Comunidad e IA avanzada** | 3–4 meses | Recetas de usuarios, gamificación, chef IA conversacional, reconocimiento de plato por foto, cursos, podcast |
| **Fase 3 — Escuela y marketplace** | 6+ meses | Certificados, marketplace, API pública/B2B, experiencias físicas, árbol genealógico de recetas |

---

# 23. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Contenido histórico impreciso (afirmaciones sobre inmigración árabe sin rigor) | Rol de Historiador humano valida todo contenido narrativo antes de publicar; IA asiste pero no publica investigación sola |
| Catálogo insuficiente al lanzamiento (percepción de "app vacía") | Fase 0 exige mínimo 30–50 recetas fundacionales de alta calidad antes de abrir registro público |
| Dependencia de un solo fundador para contenido | Flujo de contribución semanal de comunidad desde el día uno, con curaduría |
| Costo de IA (generación de imágenes, voz, video) | Empezar con generación bajo demanda y cacheo agresivo; medir costo por usuario antes de escalar features caras (RA, video) |
| Confusión de marca (3 nombres candidatos) | Resuelto: LEGADO como marca única de producto, Abuela Tula/Tío Roberto como personajes narradores, Costa & Cedro como sello editorial interno |

---

# 24. Próximos pasos inmediatos

1. Validar este PRD y el de Arquitectura Técnica.
2. Instalar los agentes especializados (`/agentes`) en el flujo de trabajo (Claude Code / VS Code).
3. Curar las primeras 30–50 recetas fundacionales (contenido + historia + fotos).
4. Levantar el proyecto en Supabase + repo en GitHub siguiendo `Arquitectura_Tecnica.pdf`.
5. Diseñar la identidad visual final a partir de los 3 conceptos de logo entregados.

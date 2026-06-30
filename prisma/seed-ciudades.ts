import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ──────────────────────────────────────────────
// IDs fijos para cada ciudad y sus entidades
// Formato: 550e8400-e29b-41d4-a716-44665544XXXX
// Rango Cartagena: 0001-0999 (existente)
// Rango Barranquilla: 1XXX
// Rango Santa Marta: 2XXX
// Rango Sincelejo: 3XXX
// Rango Montería: 4XXX
// Rango Valledupar: 5XXX
// ──────────────────────────────────────────────

interface CitySeed {
  id: string;
  gameId: string;
  storyId: string;
  routeId: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  gameName: string;
  gameDesc: string;
  storyName: string;
  storyIntro: string;
  storyLore: string;
  objectives: string[];
  routeName: string;
  routeDesc: string;
  difficulty: string;
  distance: number;
  minutes: number;
  checkpoints: {
    id: string;
    missionId: string;
    qrId: string;
    name: string;
    desc: string;
    lat: number;
    lng: number;
    idx: number;
  }[];
  endingIds: string[];
}

const CITY_DATA: CitySeed[] = [
  // ── Barranquilla ──
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    gameId: '550e8400-e29b-41d4-a716-446655441001',
    storyId: '550e8400-e29b-41d4-a716-446655441002',
    routeId: '550e8400-e29b-41d4-a716-446655441003',
    name: 'Barranquilla',
    slug: 'barranquilla',
    latitude: 10.9865,
    longitude: -74.7875,
    gameName: 'El Secreto del Río',
    gameDesc: 'Un viaje por la puerta de oro de Colombia, siguiendo las huellas del río Magdalena.',
    storyName: 'La Puerta de Oro',
    storyIntro: 'Barranquilla guarda secretos que solo el río conoce...',
    storyLore: 'Desde la época dorada del río Magdalena, la ciudad ha sido custodio de tradiciones y misterios que esperan ser descubiertos.',
    objectives: ['Descubrir el legado del Río', 'Desbloquear los secretos del Carnaval', 'Encontrar el tesoro escondido'],
    routeName: 'Ruta del Río',
    routeDesc: 'Recorrido por los lugares emblemáticos de Barranquilla junto al río Magdalena.',
    difficulty: 'EASY',
    distance: 5000,
    minutes: 90,
    checkpoints: [
      { id: '550e8400-e29b-41d4-a716-446655441011', missionId: '550e8400-e29b-41d4-a716-446655441021', qrId: '550e8400-e29b-41d4-a716-446655441031', name: 'Plaza de la Paz', desc: 'El corazón de Barranquilla. Busca el primer sello en la Catedral Metropolitana.', lat: 10.9865, lng: -74.7875, idx: 1 },
      { id: '550e8400-e29b-41d4-a716-446655441012', missionId: '550e8400-e29b-41d4-a716-446655441022', qrId: '550e8400-e29b-41d4-a716-446655441032', name: 'Paseo de Bolívar', desc: 'El malecón guarda historias de navegantes. Encuentra el segundo marcador.', lat: 10.9875, lng: -74.7885, idx: 2 },
      { id: '550e8400-e29b-41d4-a716-446655441013', missionId: '550e8400-e29b-41d4-a716-446655441023', qrId: '550e8400-e29b-41d4-a716-446655441033', name: 'Estadio Metropolitano', desc: 'La energía del fútbol se mezcla con la brisa del río. Sigue la señal.', lat: 10.9268, lng: -74.8015, idx: 3 },
      { id: '550e8400-e29b-41d4-a716-446655441014', missionId: '550e8400-e29b-41d4-a716-446655441024', qrId: '550e8400-e29b-41d4-a716-446655441034', name: 'Puerto de Colombia', desc: 'El puerto fue la puerta de entrada. El último fragmento te espera aquí.', lat: 10.9795, lng: -74.7815, idx: 4 },
    ],
    endingIds: ['550e8400-e29b-41d4-a716-446655441041', '550e8400-e29b-41d4-a716-446655441042'],
  },

  // ── Santa Marta ──
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    gameId: '550e8400-e29b-41d4-a716-446655442001',
    storyId: '550e8400-e29b-41d4-a716-446655442002',
    routeId: '550e8400-e29b-41d4-a716-446655442003',
    name: 'Santa Marta',
    slug: 'santa-marta',
    latitude: 11.2422,
    longitude: -74.2126,
    gameName: 'El Legado de Tayrona',
    gameDesc: 'Explora la ciudad más antigua de Colombia, donde la montaña besa el mar Caribe.',
    storyName: 'La Primera Ciudad',
    storyIntro: 'Santa Marta guarda los ecos de la conquista y el legado de los Tayrona...',
    storyLore: 'Fundada en 1525, Santa Marta es la ciudad más antigua de Colombia. Sus calles esconden siglos de historia entre la Sierra Nevada y el mar.',
    objectives: ['Recorrer el centro histórico', 'Encontrar las huellas de los Tayrona', 'Descubrir el secreto del Libertador'],
    routeName: 'Ruta Histórica',
    routeDesc: 'Recorrido por los sitios históricos más importantes de Santa Marta.',
    difficulty: 'MEDIUM',
    distance: 3500,
    minutes: 90,
    checkpoints: [
      { id: '550e8400-e29b-41d4-a716-446655442011', missionId: '550e8400-e29b-41d4-a716-446655442021', qrId: '550e8400-e29b-41d4-a716-446655442031', name: 'Parque de los Novios', desc: 'El corazón del centro histórico. Aquí comienza la aventura.', lat: 11.2422, lng: -74.2126, idx: 1 },
      { id: '550e8400-e29b-41d4-a716-446655442012', missionId: '550e8400-e29b-41d4-a716-446655442022', qrId: '550e8400-e29b-41d4-a716-446655442032', name: 'Catedral de Santa Marta', desc: 'La catedral más antigua guarda los restos del Libertador. Busca el marcador.', lat: 11.2430, lng: -74.2130, idx: 2 },
      { id: '550e8400-e29b-41d4-a716-446655442013', missionId: '550e8400-e29b-41d4-a716-446655442023', qrId: '550e8400-e29b-41d4-a716-446655442033', name: 'Quinta de San Pedro Alejandrino', desc: 'Donde Simón Bolívar pasó sus últimos días. La historia te espera.', lat: 11.2330, lng: -74.1950, idx: 3 },
      { id: '550e8400-e29b-41d4-a716-446655442014', missionId: '550e8400-e29b-41d4-a716-446655442024', qrId: '550e8400-e29b-41d4-a716-446655442034', name: 'Bahía de Santa Marta', desc: 'El mar Caribe guarda el último secreto. Escanea el QR en el malecón.', lat: 11.2440, lng: -74.2150, idx: 4 },
    ],
    endingIds: ['550e8400-e29b-41d4-a716-446655442041', '550e8400-e29b-41d4-a716-446655442042'],
  },

  // ── Sincelejo ──
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    gameId: '550e8400-e29b-41d4-a716-446655443001',
    storyId: '550e8400-e29b-41d4-a716-446655443002',
    routeId: '550e8400-e29b-41d4-a716-446655443003',
    name: 'Sincelejo',
    slug: 'sincelejo',
    latitude: 9.3029,
    longitude: -75.3906,
    gameName: 'El Misterio de las Sabanas',
    gameDesc: 'Descubre los secretos de la capital del departamento de Sucre, tierra de sabanas y tradiciones.',
    storyName: 'Corazón de Sucre',
    storyIntro: 'Sincelejo te invita a explorar sus calles llenas de cultura y tradición...',
    storyLore: 'Sincelejo, conocida como la capital de la cultura del Caribe colombiano, guarda entre sus calles la esencia de las sabanas y el folclor.',
    objectives: ['Explorar el centro cívico', 'Descubrir las tradiciones sabaneras', 'Encontrar el tesoro cultural'],
    routeName: 'Ruta Cívica',
    routeDesc: 'Recorrido por el centro de Sincelejo, descubriendo su cultura y tradiciones.',
    difficulty: 'EASY',
    distance: 2000,
    minutes: 60,
    checkpoints: [
      { id: '550e8400-e29b-41d4-a716-446655443011', missionId: '550e8400-e29b-41d4-a716-446655443021', qrId: '550e8400-e29b-41d4-a716-446655443031', name: 'Parque Santander', desc: 'La plaza principal de Sincelejo. Inicia tu búsqueda aquí.', lat: 9.3029, lng: -75.3906, idx: 1 },
      { id: '550e8400-e29b-41d4-a716-446655443012', missionId: '550e8400-e29b-41d4-a716-446655443022', qrId: '550e8400-e29b-41d4-a716-446655443032', name: 'Catedral San Francisco de Asís', desc: 'La catedral custodia los secretos de la ciudad.', lat: 9.3035, lng: -75.3910, idx: 2 },
      { id: '550e8400-e29b-41d4-a716-446655443013', missionId: '550e8400-e29b-41d4-a716-446655443023', qrId: '550e8400-e29b-41d4-a716-446655443033', name: 'Mercado Público', desc: 'Los sabores de las sabanas te guiarán al siguiente marcador.', lat: 9.3015, lng: -75.3890, idx: 3 },
    ],
    endingIds: ['550e8400-e29b-41d4-a716-446655443041', '550e8400-e29b-41d4-a716-446655443042'],
  },

  // ── Montería ──
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    gameId: '550e8400-e29b-41d4-a716-446655444001',
    storyId: '550e8400-e29b-41d4-a716-446655444002',
    routeId: '550e8400-e29b-41d4-a716-446655444003',
    name: 'Montería',
    slug: 'monteria',
    latitude: 8.7570,
    longitude: -75.8820,
    gameName: 'El Enigma del Sinú',
    gameDesc: 'Aventura por la capital ganadera de Colombia, bañada por el río Sinú.',
    storyName: 'Perla del Sinú',
    storyIntro: 'Montería se extiende a orillas del Sinú, guardando historias de vaqueros y leyendas...',
    storyLore: 'Montería, la capital del departamento de Córdoba, es conocida como la "capital ganadera de Colombia". Sus calles están llenas de historias del río Sinú.',
    objectives: ['Recorrer la ribera del Sinú', 'Descubrir la cultura vaquera', 'Encontrar el legado del río'],
    routeName: 'Ruta del Sinú',
    routeDesc: 'Recorrido por los puntos emblemáticos de la capital cordobesa.',
    difficulty: 'MEDIUM',
    distance: 4000,
    minutes: 90,
    checkpoints: [
      { id: '550e8400-e29b-41d4-a716-446655444011', missionId: '550e8400-e29b-41d4-a716-446655444021', qrId: '550e8400-e29b-41d4-a716-446655444031', name: 'Parque Simón Bolívar', desc: 'El parque principal de Montería. Comienza tu recorrido aquí.', lat: 8.7570, lng: -75.8820, idx: 1 },
      { id: '550e8400-e29b-41d4-a716-446655444012', missionId: '550e8400-e29b-41d4-a716-446655444022', qrId: '550e8400-e29b-41d4-a716-446655444032', name: 'Catedral San Jerónimo', desc: 'La catedral frente al parque guarda el segundo marcador.', lat: 8.7575, lng: -75.8828, idx: 2 },
      { id: '550e8400-e29b-41d4-a716-446655444013', missionId: '550e8400-e29b-41d4-a716-446655444023', qrId: '550e8400-e29b-41d4-a716-446655444033', name: 'Malecón del Sinú', desc: 'El río Sinú cuenta historias de vaqueros y pescadores. Sigue la corriente.', lat: 8.7550, lng: -75.8810, idx: 3 },
      { id: '550e8400-e29b-41d4-a716-446655444014', missionId: '550e8400-e29b-41d4-a716-446655444024', qrId: '550e8400-e29b-41d4-a716-446655444034', name: 'Estadio Jaraguay', desc: 'El estadio vibra con la pasión del fútbol. El último marcador te espera.', lat: 8.7680, lng: -75.8700, idx: 4 },
    ],
    endingIds: ['550e8400-e29b-41d4-a716-446655444041', '550e8400-e29b-41d4-a716-446655444042'],
  },

  // ── Valledupar ──
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    gameId: '550e8400-e29b-41d4-a716-446655445001',
    storyId: '550e8400-e29b-41d4-a716-446655445002',
    routeId: '550e8400-e29b-41d4-a716-446655445003',
    name: 'Valledupar',
    slug: 'valledupar',
    latitude: 10.4776,
    longitude: -73.2445,
    gameName: 'El Acordeón Mágico',
    gameDesc: 'Recorre la capital mundial del vallenato, donde la música y la leyenda se entrelazan.',
    storyName: 'Tierra del Vallenato',
    storyIntro: 'Valledupar, cuna de acordeones y versos, guarda un secreto musical...',
    storyLore: 'Valledupar, la capital del Cesar, es mundialmente conocida como la cuna del vallenato. Sus calles resuenan con acordeones y leyendas.',
    objectives: ['Explorar el centro fundacional', 'Descubrir los orígenes del vallenato', 'Encontrar la canción perdida'],
    routeName: 'Ruta del Vallenato',
    routeDesc: 'Recorrido musical por la ciudad de los acordeones.',
    difficulty: 'EASY',
    distance: 3000,
    minutes: 75,
    checkpoints: [
      { id: '550e8400-e29b-41d4-a716-446655445011', missionId: '550e8400-e29b-41d4-a716-446655445021', qrId: '550e8400-e29b-41d4-a716-446655445031', name: 'Plaza Alfonso López', desc: 'La plaza principal de Valledupar. El acordeón suena al inicio de la aventura.', lat: 10.4776, lng: -73.2445, idx: 1 },
      { id: '550e8400-e29b-41d4-a716-446655445012', missionId: '550e8400-e29b-41d4-a716-446655445022', qrId: '550e8400-e29b-41d4-a716-446655445032', name: 'Iglesia de la Inmaculada Concepción', desc: 'La catedral guarda el segundo compás de la melodía.', lat: 10.4780, lng: -73.2440, idx: 2 },
      { id: '550e8400-e29b-41d4-a716-446655445013', missionId: '550e8400-e29b-41d4-a716-446655445023', qrId: '550e8400-e29b-41d4-a716-446655445033', name: 'Casa de la Cultura', desc: 'La cultura vallenata vive aquí. Encuentra la letra de la canción.', lat: 10.4765, lng: -73.2435, idx: 3 },
      { id: '550e8400-e29b-41d4-a716-446655445014', missionId: '550e8400-e29b-41d4-a716-446655445024', qrId: '550e8400-e29b-41d4-a716-446655445034', name: 'Parque de la Leyenda Vallenata', desc: 'El festival más importante del vallenato. La canción completa te espera.', lat: 10.4700, lng: -73.2500, idx: 4 },
    ],
    endingIds: ['550e8400-e29b-41d4-a716-446655445041', '550e8400-e29b-41d4-a716-446655445042'],
  },
];

const MISSION_TITLES = [
  'Primer Paso', 'La Señal', 'El Encuentro', 'Destino Final',
];

const MISSION_NARRATIVES = [
  'Todo viaje comienza con un primer paso. Tu misión es llegar al punto de inicio y escanear el código.',
  'Las señales están por todas partes. Sigue las pistas que la ciudad te ofrece.',
  'El encuentro con la historia te revelará los secretos mejor guardados de este lugar.',
  'El destino final te espera. Todas las piezas se unen aquí para completar tu misión.',
];

async function main() {
  console.log('🌱 Seeding nuevas ciudades para City Quest Explorer...\n');

  for (const cityData of CITY_DATA) {
    console.log(`\n--- Creando: ${cityData.name} ---`);

    // ── City ──
    const city = await prisma.city.upsert({
      where: { id: cityData.id },
      update: { latitude: cityData.latitude, longitude: cityData.longitude },
      create: {
        id: cityData.id,
        name: cityData.name,
        slug: cityData.slug,
        country: 'Colombia',
        state: 'ACTIVE',
        latitude: cityData.latitude,
        longitude: cityData.longitude,
      },
    });
    console.log(`  ✅ City: ${city.name} (${city.slug})`);

    // ── Game ──
    const game = await prisma.game.upsert({
      where: { id: cityData.gameId },
      update: {},
      create: {
        id: cityData.gameId,
        cityId: city.id,
        name: cityData.gameName,
        description: cityData.gameDesc,
        durationMinutes: cityData.minutes,
        difficulty: cityData.difficulty,
        status: 'PUBLISHED',
        maxPlayers: 5,
      },
    });
    console.log(`  ✅ Game: ${game.name}`);

    // ── Story ──
    const story = await prisma.story.upsert({
      where: { id: cityData.storyId },
      update: {},
      create: {
        id: cityData.storyId,
        gameId: game.id,
        name: cityData.storyName,
        introduction: cityData.storyIntro,
        lore: cityData.storyLore,
        objectives: cityData.objectives,
        rules: 'No compartir respuestas con otros equipos. Seguir el orden de las misiones.',
        status: 'PUBLISHED',
      },
    });
    console.log(`  ✅ Story: ${story.name}`);

    // ── Route ──
    const route = await prisma.route.upsert({
      where: { id: cityData.routeId },
      update: {},
      create: {
        id: cityData.routeId,
        storyId: story.id,
        cityId: city.id,
        name: cityData.routeName,
        description: cityData.routeDesc,
        difficulty: cityData.difficulty,
        distanceMeters: cityData.distance,
        estimatedMinutes: cityData.minutes,
        isDefault: true,
        status: 'PUBLISHED',
      },
    });
    console.log(`  ✅ Route: ${route.name}`);

    // ── Checkpoints + Missions + QR Codes ──
    for (const cp of cityData.checkpoints) {
      // Checkpoint
      await prisma.checkpoint.upsert({
        where: { id: cp.id },
        update: { name: cp.name, latitude: cp.lat, longitude: cp.lng },
        create: {
          id: cp.id,
          routeId: route.id,
          name: cp.name,
          description: cp.desc,
          latitude: cp.lat,
          longitude: cp.lng,
          orderIndex: cp.idx,
        },
      });

      // Mission
      await prisma.mission.upsert({
        where: { id: cp.missionId },
        update: { title: MISSION_TITLES[cp.idx - 1] },
        create: {
          id: cp.missionId,
          routeId: route.id,
          title: MISSION_TITLES[cp.idx - 1],
          narrative: MISSION_NARRATIVES[cp.idx - 1],
          description: cp.desc,
          orderIndex: cp.idx,
          difficulty: cp.idx <= 2 ? 3 : 7,
          checkpointId: cp.id,
          isLastMission: cp.idx === cityData.checkpoints.length,
        },
      });

      // QR Code
      const qrCode = `CQE-${cityData.slug.toUpperCase().replace('-', '')}-${String(cp.idx).padStart(2, '0')}`;
      await prisma.qRCode.upsert({
        where: { id: cp.qrId },
        update: { code: qrCode },
        create: {
          id: cp.qrId,
          routeId: route.id,
          checkpointId: cp.id,
          code: qrCode,
        },
      });

      console.log(`  ✅ M${cp.idx}: ${MISSION_TITLES[cp.idx - 1]} → ${cp.name} → QR: ${qrCode}`);
    }

    // ── StoryEndings ──
    await prisma.storyEnding.upsert({
      where: { id: cityData.endingIds[0] },
      update: {},
      create: {
        id: cityData.endingIds[0],
        storyId: story.id,
        name: 'Misión Cumplida',
        description: `El equipo logró descubrir todos los secretos de ${cityData.name}.`,
        conditions: { minScore: 300, requiredMissions: cityData.checkpoints.length },
        narrative: `Y así, los aventureros descubrieron los secretos que ${cityData.name} guardaba celosamente. La ciudad reveló sus misterios a quienes supieron buscarlos con atención y respeto.`,
        orderIndex: 0,
      },
    });

    await prisma.storyEnding.upsert({
      where: { id: cityData.endingIds[1] },
      update: {},
      create: {
        id: cityData.endingIds[1],
        storyId: story.id,
        name: 'El Misterio Continúa',
        description: 'El equipo descubrió que hay más capas en el misterio de las que imaginaban.',
        conditions: { minScore: 150, requiredMissions: Math.ceil(cityData.checkpoints.length / 2) },
        narrative: `El viaje por ${cityData.name} reveló solo una parte de la verdad. Nuevas pistas apuntan a secretos aún mayores escondidos en la región.`,
        orderIndex: 1,
      },
    });

    console.log(`  ✅ Story Endings creados`);
  }

  console.log('\n🎉 Seed de nuevas ciudades completado exitosamente!');
  console.log(`\n📋 Ciudades creadas:`);
  CITY_DATA.forEach(c => console.log(`   - ${c.name} (${c.slug})`));
}

main()
  .catch((e) => {
    console.error('\n❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

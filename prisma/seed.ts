import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding City Quest Explorer — Cartagena Pilot (10 misiones)...\n');

  // ── IDs determinísticos ──
  const CITY_ID = '550e8400-e29b-41d4-a716-446655440001';
  const GAME_ID = '550e8400-e29b-41d4-a716-446655440002';
  const STORY_ID = '550e8400-e29b-41d4-a716-446655440003';
  const ROUTE_ID = '550e8400-e29b-41d4-a716-446655440010';

  // ── City: Cartagena de Indias ──
  const city = await prisma.city.upsert({
    where: { id: CITY_ID },
    update: {},
    create: {
      id: CITY_ID,
      name: 'Cartagena de Indias',
      slug: 'cartagena',
      country: 'Colombia',
      state: 'ACTIVE',
    },
  });
  console.log(`  ✅ City: ${city.name} (${city.id})`);

  // ── Game: El Manuscrito Prohibido ──
  const game = await prisma.game.upsert({
    where: { id: GAME_ID },
    update: {},
    create: {
      id: GAME_ID,
      cityId: city.id,
      name: 'El Manuscrito Prohibido',
      description: 'Una aventura urbana por las calles de Cartagena para descubrir los secretos del manuscrito maldito.',
      durationMinutes: 120,
      difficulty: 'MEDIUM',
      status: 'PUBLISHED',
      maxPlayers: 5,
    },
  });
  console.log(`  ✅ Game: ${game.name} (${game.id})`);

  // ── Story: Historia Principal ──
  const story = await prisma.story.upsert({
    where: { id: STORY_ID },
    update: {},
    create: {
      id: STORY_ID,
      gameId: game.id,
      name: 'Historia Principal',
      introduction: 'En las calles empedradas de Cartagena, un manuscrito perdido espera ser encontrado...',
      lore: 'Hace tres siglos, un manuscrito fue fragmentado y dispersado por la ciudad. Solo aquellos que caminen con intención podrán restaurarlo.',
      objectives: ['Encontrar el Manuscrito Prohibido', 'Descubrir la verdad oculta', 'Proteger el secreto de Cartagena'],
      rules: 'No compartir respuestas con otros equipos. Seguir el orden de las misiones.',
      status: 'PUBLISHED',
    },
  });
  console.log(`  ✅ Story: ${story.name} (${story.id})`);

  // ── Route: Ruta Principal ──
  const route = await prisma.route.upsert({
    where: { id: ROUTE_ID },
    update: {},
    create: {
      id: ROUTE_ID,
      storyId: story.id,
      cityId: city.id,
      name: 'Ruta Principal - Centro Histórico',
      description: 'Recorrido por el centro histórico de Cartagena siguiendo las pistas del Manuscrito.',
      difficulty: 'MEDIUM',
      distanceMeters: 4000,
      estimatedMinutes: 120,
      isDefault: true,
      status: 'PUBLISHED',
    },
  });
  console.log(`  ✅ Route: ${route.name} (${route.id})`);

  // ── Checkpoints (10 misiones M1–M10 del Mission Pack) ──
  const checkpoints = [
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      name: 'Baluarte Santa Catalina',
      description: 'La piedra despierta cuando caminas con intención. Escanea el QR en la muralla.',
      latitude: 10.4236, longitude: -75.5532, orderIndex: 1,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440102',
      name: 'Plaza de la Aduana',
      description: 'La Aduana guarda relojes invisibles. Encuentra el QR entre los soportales.',
      latitude: 10.4225, longitude: -75.5501, orderIndex: 2,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440103',
      name: 'Castillo San Felipe',
      description: 'En el Castillo la ciudad se alinea. Busca la marca del manuscrito.',
      latitude: 10.4231, longitude: -75.5403, orderIndex: 3,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440104',
      name: 'La Popa',
      description: 'El viento es una pregunta. El mirador guarda el siguiente fragmento.',
      latitude: 10.4210, longitude: -75.5340, orderIndex: 4,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440105',
      name: 'Camellón de los Mártires',
      description: 'La ruta perdona. Recorre el Camellón hasta encontrar la señal oculta.',
      latitude: 10.4245, longitude: -75.5470, orderIndex: 5,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440106',
      name: 'Getsemaní',
      description: 'La piedra guarda letras que no gritan. Descifra el mensaje en las calles del barrio.',
      latitude: 10.4247, longitude: -75.5525, orderIndex: 6,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440107',
      name: 'Calle de la Amargura',
      description: 'No es una pista: son señales. Observa lo que la ciudad intenta ocultar.',
      latitude: 10.4253, longitude: -75.5495, orderIndex: 7,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440108',
      name: 'Bocagrande',
      description: 'El regreso escribe el verdadero mapa. Busca el QR en el malecón.',
      latitude: 10.4080, longitude: -75.5550, orderIndex: 8,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440109',
      name: 'Pastelillo',
      description: 'La amenaza es un examen de calma. La ciudad evalúa decisiones, no prisa.',
      latitude: 10.4150, longitude: -75.5480, orderIndex: 9,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440110',
      name: 'Muelle de los Pegasos',
      description: 'Junta los diez fragmentos. El Manuscrito te espera en la bahía.',
      latitude: 10.4200, longitude: -75.5430, orderIndex: 10,
    },
  ];

  for (const cp of checkpoints) {
    await prisma.checkpoint.upsert({
      where: { id: cp.id },
      update: { name: cp.name, description: cp.description, latitude: cp.latitude, longitude: cp.longitude, orderIndex: cp.orderIndex },
      create: { id: cp.id, routeId: route.id, name: cp.name, description: cp.description, latitude: cp.latitude, longitude: cp.longitude, orderIndex: cp.orderIndex },
    });

    // ── Missions (M1–M10) con narrative ──
    const missionId = cp.id.replace('44010', '44030');
    const missionNames = [
      'Juramento en la Muralla',
      'La Aduana del Tiempo',
      'El Cálculo del Castillo',
      'Viento de La Popa',
      'Sendero con Tolerancia',
      'Cifrado de Piedra',
      'Observación',
      'Registro del Regreso',
      'Peligro Controlado',
      'Capítulo Final',
    ];

    const missionNarratives = [
      'La piedra despierta cuando el equipo camina con intención. El Manuscrito no pide velocidad: pide atención.',
      'La Aduana guarda relojes invisibles; el Manuscrito traduce el tiempo a dirección.',
      'En el Castillo la ciudad se alinea. La brújula emocional responde cuando la ubicación "encaja".',
      'El viento es una pregunta. Si el equipo escucha el lugar, el QR ya conoce la respuesta.',
      'La ruta perdona: la exactitud es un mito si el equipo mantiene su ritmo.',
      'La piedra guarda letras que no gritan. El Manuscrito te da el índice, no la frase.',
      'No es una pista: son señales. El equipo debe notar lo que la ciudad intenta ocultar.',
      'El regreso escribe el verdadero mapa. El tiempo ordena el ciclo cuando vuelves.',
      'La amenaza es un examen de calma. La ciudad evalúa decisiones, no prisa.',
      'Juntar los diez no es terminar: es volver legible el camino que el Manuscrito te pidió.',
    ];

    await prisma.mission.upsert({
      where: { id: missionId },
      update: {
        title: missionNames[cp.orderIndex - 1],
        narrative: missionNarratives[cp.orderIndex - 1],
        description: cp.description,
      },
      create: {
        id: missionId,
        routeId: route.id,
        title: missionNames[cp.orderIndex - 1],
        narrative: missionNarratives[cp.orderIndex - 1],
        description: cp.description,
        orderIndex: cp.orderIndex,
        difficulty: cp.orderIndex <= 2 ? 3 : cp.orderIndex <= 5 ? 5 : cp.orderIndex <= 8 ? 7 : 9,
        checkpointId: cp.id,
        isLastMission: cp.orderIndex === 10,
      },
    });

    // ── QR Code para cada checkpoint ──
    const qrId = cp.id.replace('44010', '44020');
    const qrCode = `CQE-MP-${String(cp.orderIndex).padStart(2, '0')}-CARTAGENA`;

    await prisma.qRCode.upsert({
      where: { id: qrId },
      update: { code: qrCode },
      create: { id: qrId, routeId: route.id, checkpointId: cp.id, code: qrCode },
    });

    console.log(`  ✅ M${cp.orderIndex}: ${missionNames[cp.orderIndex - 1]} → Checkpoint → QR: ${qrCode}`);
  }

  // ── Challenges para M1 (ejemplo) ──
  const m1MissionId = '550e8400-e29b-41d4-a716-446655440301';
  const challengeId = '550e8400-e29b-41d4-a716-446655440401';

  await prisma.challenge.upsert({
    where: { id: challengeId },
    update: { prompt: '¿Qué palabra dejó Isabella como pista principal?' },
    create: {
      id: challengeId,
      missionId: m1MissionId,
      type: 'SECRET_CODE',
      prompt: '¿Qué palabra dejó Isabella como pista principal?',
      hint1: 'Busca en la carta de Isabella',
      hint2: 'Está relacionada con un lugar de Cartagena',
      hint3: 'Comienza con la letra M',
      hint4: 'La respuesta es MARTIR',
      orderIndex: 0,
      penalty: 5,
    },
  });

  await prisma.challengeAnswer.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440501' },
    update: { value: 'MARTIR' },
    create: {
      id: '550e8400-e29b-41d4-a716-446655440501',
      challengeId,
      value: 'MARTIR',
      label: 'Respuesta correcta',
      isCorrect: true,
      orderIndex: 0,
    },
  });

  await prisma.challengeAnswer.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440502' },
    update: { value: 'MARTYR' },
    create: {
      id: '550e8400-e29b-41d4-a716-446655440502',
      challengeId,
      value: 'MARTYR',
      label: 'Variante en inglés',
      isCorrect: true,
      orderIndex: 1,
    },
  });

  // ── StoryEnding: Final Feliz (ejemplo) ──
  await prisma.storyEnding.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440601' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440601',
      storyId: story.id,
      name: 'El Manuscrito Restaurado',
      description: 'El equipo logra restaurar el Manuscrito Prohibido y Cartagena está a salvo.',
      conditions: { minScore: 500, requiredMissions: 10 },
      narrative: 'Y así, los investigadores lograron restaurar el Manuscrito. El Notario del Viento perdió su poder sobre la ciudad, y el secreto de Cartagena quedó protegido por una nueva generación de guardianes.',
      orderIndex: 0,
    },
  });

  await prisma.storyEnding.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440602' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440602',
      storyId: story.id,
      name: 'El Misterio Continúa',
      description: 'El equipo descubre que hay más capas en el misterio de las que imaginaban.',
      conditions: { minScore: 300, requiredMissions: 7 },
      narrative: 'El Manuscrito reveló solo una parte de la verdad. El Notario del Viento escapó, y nuevas pistas apuntan a un secreto aún mayor escondido en las profundidades de Cartagena.',
      orderIndex: 1,
    },
  });

  console.log('\n🎉 Seed completado exitosamente — Game + Story + 10 misiones + Challenges + Endings!');
  console.log(`\n📋 IDs para referencia:`);
  console.log(`   City ID:  ${CITY_ID}`);
  console.log(`   Game ID:  ${GAME_ID}`);
  console.log(`   Story ID: ${STORY_ID}`);
  console.log(`   Route ID: ${ROUTE_ID}`);
}

main()
  .catch((e) => {
    console.error('\n❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

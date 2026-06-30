import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding City Quest Explorer — Cartagena Pilot (10 misiones)...\n');

  // ── IDs determinísticos ──
  const CITY_ID = '550e8400-e29b-41d4-a716-446655440001';
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
    },
  });
  console.log(`  ✅ City: ${city.name} (${city.id})`);

  // ── Route: El Manuscrito Prohibido ──
  const route = await prisma.route.upsert({
    where: { id: ROUTE_ID },
    update: {},
    create: {
      id: ROUTE_ID,
      cityId: city.id,
      name: 'El Manuscrito Prohibido',
      description:
        'Una aventura urbana por las calles de Cartagena para descubrir los secretos del manuscrito maldito.',
      difficulty: 'MEDIUM',
      distanceMeters: 4000,
      estimatedMinutes: 120,
    },
  });
  console.log(`  ✅ Route: ${route.name} (${route.id})`);

  // ── Checkpoints (10 misiones M1–M10 del Mission Pack) ──
  const checkpoints = [
    // M1 — Juramento en la Muralla
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      name: 'Baluarte Santa Catalina',
      description: 'La piedra despierta cuando caminas con intención. Escanea el QR en la muralla.',
      latitude: 10.4236,
      longitude: -75.5532,
      orderIndex: 1,
    },
    // M2 — La Aduana del Tiempo
    {
      id: '550e8400-e29b-41d4-a716-446655440102',
      name: 'Plaza de la Aduana',
      description: 'La Aduana guarda relojes invisibles. Encuentra el QR entre los soportales.',
      latitude: 10.4225,
      longitude: -75.5501,
      orderIndex: 2,
    },
    // M3 — El Cálculo del Castillo
    {
      id: '550e8400-e29b-41d4-a716-446655440103',
      name: 'Castillo San Felipe',
      description: 'En el Castillo la ciudad se alinea. Busca la marca del manuscrito.',
      latitude: 10.4231,
      longitude: -75.5403,
      orderIndex: 3,
    },
    // M4 — Viento de La Popa
    {
      id: '550e8400-e29b-41d4-a716-446655440104',
      name: 'La Popa',
      description: 'El viento es una pregunta. El mirador guarda el siguiente fragmento.',
      latitude: 10.4210,
      longitude: -75.5340,
      orderIndex: 4,
    },
    // M5 — Sendero con Tolerancia
    {
      id: '550e8400-e29b-41d4-a716-446655440105',
      name: 'Camellón de los Mártires',
      description: 'La ruta perdona. Recorre el Camellón hasta encontrar la señal oculta.',
      latitude: 10.4245,
      longitude: -75.5470,
      orderIndex: 5,
    },
    // M6 — Santo Domingo: Cifrado de Piedra
    {
      id: '550e8400-e29b-41d4-a716-446655440106',
      name: 'Getsemaní',
      description: 'La piedra guarda letras que no gritan. Descifra el mensaje en las calles del barrio.',
      latitude: 10.4247,
      longitude: -75.5525,
      orderIndex: 6,
    },
    // M7 — Calle de la Amargura: Observación
    {
      id: '550e8400-e29b-41d4-a716-446655440107',
      name: 'Calle de la Amargura',
      description: 'No es una pista: son señales. Observa lo que la ciudad intenta ocultar.',
      latitude: 10.4253,
      longitude: -75.5495,
      orderIndex: 7,
    },
    // M8 — Bocagrande: Registro del Regreso
    {
      id: '550e8400-e29b-41d4-a716-446655440108',
      name: 'Bocagrande',
      description: 'El regreso escribe el verdadero mapa. Busca el QR en el malecón.',
      latitude: 10.4080,
      longitude: -75.5550,
      orderIndex: 8,
    },
    // M9 — Pastelillo: Peligro Controlado
    {
      id: '550e8400-e29b-41d4-a716-446655440109',
      name: 'Pastelillo',
      description: 'La amenaza es un examen de calma. La ciudad evalúa decisiones, no prisa.',
      latitude: 10.4150,
      longitude: -75.5480,
      orderIndex: 9,
    },
    // M10 — Muelle de los Pegasos: Capítulo Final
    {
      id: '550e8400-e29b-41d4-a716-446655440110',
      name: 'Muelle de los Pegasos',
      description: 'Junta los diez fragmentos. El Manuscrito te espera en la bahía.',
      latitude: 10.4200,
      longitude: -75.5430,
      orderIndex: 10,
    },
  ];

  for (const cp of checkpoints) {
    await prisma.checkpoint.upsert({
      where: { id: cp.id },
      update: {
        name: cp.name,
        description: cp.description,
        latitude: cp.latitude,
        longitude: cp.longitude,
        orderIndex: cp.orderIndex,
      },
      create: {
        id: cp.id,
        routeId: route.id,
        name: cp.name,
        description: cp.description,
        latitude: cp.latitude,
        longitude: cp.longitude,
        orderIndex: cp.orderIndex,
      },
    });

    // ── QR Code para cada checkpoint ──
    const qrId = cp.id.replace('44010', '44020');
    const qrCode = `CQE-MP-${String(cp.orderIndex).padStart(2, '0')}-CARTAGENA`;

    await prisma.qRCode.upsert({
      where: { id: qrId },
      update: { code: qrCode },
      create: {
        id: qrId,
        routeId: route.id,
        checkpointId: cp.id,
        code: qrCode,
      },
    });

    console.log(`  ✅ Checkpoint #${cp.orderIndex}: ${cp.name} → QR: ${qrCode}`);
  }

  console.log('\n🎉 Seed completado exitosamente — 10 misiones listas!');
  console.log(`\n📋 IDs de ruta/ciudad para Flutter:`);
  console.log(`   City ID:  ${CITY_ID}`);
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

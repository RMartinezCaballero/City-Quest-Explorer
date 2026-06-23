import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding City Quest Explorer — Cartagena Pilot...\n');

  // ── IDs determinísticos para que Flutter los use ──
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
      distanceMeters: 2500,
      estimatedMinutes: 90,
    },
  });
  console.log(`  ✅ Route: ${route.name} (${route.id})`);

  // ── Checkpoints (los 5 puntos del mapa Flutter) ──
  const checkpoints = [
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      name: 'Torre del Reloj',
      description: 'Punto de inicio. La misión comienza aquí.',
      latitude: 10.4227,
      longitude: -75.5514,
      orderIndex: 1,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440102',
      name: 'Palacio de la Inquisición',
      description: 'Busca la marca del manuscrito en la fachada.',
      latitude: 10.4231,
      longitude: -75.5497,
      orderIndex: 2,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440103',
      name: 'Iglesia del Santísimo',
      description: 'El tercer fragmento aguarda entre las sombras.',
      latitude: 10.4238,
      longitude: -75.5508,
      orderIndex: 3,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440104',
      name: 'Castillo San Felipe',
      description: 'Las bóvedas guardan el secreto final.',
      latitude: 10.4231,
      longitude: -75.5403,
      orderIndex: 4,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440105',
      name: 'Las Bóvedas',
      description: 'El manuscrito espera ser descubierto.',
      latitude: 10.4278,
      longitude: -75.5486,
      orderIndex: 5,
    },
  ];

  for (const cp of checkpoints) {
    await prisma.checkpoint.upsert({
      where: { id: cp.id },
      update: {},
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

    // ── QR Code para este checkpoint ──
    const qrId = cp.id.replace('44010', '44020');
    const qrCode = `CQE-MP-${String(cp.orderIndex).padStart(2, '0')}-CARTAGENA`;

    await prisma.qRCode.upsert({
      where: { id: qrId },
      update: {},
      create: {
        id: qrId,
        routeId: route.id,
        checkpointId: cp.id,
        code: qrCode,
      },
    });

    console.log(`  ✅ Checkpoint #${cp.orderIndex}: ${cp.name}`);
    console.log(`     QR Code: ${qrCode}`);
  }

  console.log('\n🎉 Seed completado exitosamente!');
  console.log(`\n📋 IDs para actualizar en Flutter:`);
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

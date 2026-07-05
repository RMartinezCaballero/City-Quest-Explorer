/**
 * Cleanup script: Delete old city data that has non-deterministic UUIDs,
 * then re-run the seed to create fresh data with deterministic UUIDs.
 *
 * Usage: npx ts-node scripts/cleanup-seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DETERMINISTIC_IDS = [
  '550e8400-e29b-41d4-a716-446655440001', // City: Cartagena
  '550e8400-e29b-41d4-a716-446655440002', // City: Barranquilla
  '550e8400-e29b-41d4-a716-446655440003', // City: Santa Marta
  '550e8400-e29b-41d4-a716-446655440004', // City: Sincelejo
  '550e8400-e29b-41d4-a716-446655440005', // City: Montería
  '550e8400-e29b-41d4-a716-446655440006', // City: Valledupar
];

async function main() {
  console.log('🧹 Cleaning up old data...\n');

  // Find all cities that are NOT the deterministic ones
  const allCities = await prisma.city.findMany();
  const citiesToDelete = allCities.filter(
    (c) => !DETERMINISTIC_IDS.includes(c.id)
  );

  if (citiesToDelete.length === 0) {
    console.log('✅ No old cities to clean up.');
    return;
  }

  console.log(`Found ${citiesToDelete.length} cities to delete:`);
  for (const city of citiesToDelete) {
    console.log(`  - ${city.name} (${city.id}, slug: ${city.slug})`);
  }

  // Delete in reverse dependency order
  for (const city of citiesToDelete) {
    // Find all routes for this city
    const routes = await prisma.route.findMany({ where: { cityId: city.id } });
    const routeIds = routes.map((r) => r.id);

    if (routeIds.length > 0) {
      // Delete related data
      const checkpoints = await prisma.checkpoint.findMany({ where: { routeId: { in: routeIds } } });
      const checkpointIds = checkpoints.map((c) => c.id);

      console.log(`  Deleting ${routeIds.length} routes, ${checkpointIds.length} checkpoints...`);

      // Delete QR codes, missions, challenges, etc.
      await prisma.qRCode.deleteMany({ where: { routeId: { in: routeIds } } });
      
      const missions = await prisma.mission.findMany({ where: { routeId: { in: routeIds } } });
      const missionIds = missions.map((m) => m.id);
      if (missionIds.length > 0) {
        const challenges = await prisma.challenge.findMany({ where: { missionId: { in: missionIds } } });
        const challengeIds = challenges.map((c) => c.id);
        if (challengeIds.length > 0) {
          await prisma.challengeAnswer.deleteMany({ where: { challengeId: { in: challengeIds } } });
          await prisma.challenge.deleteMany({ where: { id: { in: challengeIds } } });
        }
      }
      await prisma.mission.deleteMany({ where: { routeId: { in: routeIds } } });
      await prisma.checkpoint.deleteMany({ where: { routeId: { in: routeIds } } });

      // Delete sessions, rankings, teams
      const teams = await prisma.team.findMany({ where: { routeId: { in: routeIds } } });
      const teamIds = teams.map((t) => t.id);
      if (teamIds.length > 0) {
        const sessions = await prisma.gameSession.findMany({ where: { teamId: { in: teamIds } } });
        const sessionIds = sessions.map((s) => s.id);
        if (sessionIds.length > 0) {
          await prisma.sessionEvent.deleteMany({ where: { sessionId: { in: sessionIds } } });
          await prisma.gameSession.deleteMany({ where: { id: { in: sessionIds } } });
        }
        await prisma.teamMember.deleteMany({ where: { teamId: { in: teamIds } } });
        await prisma.team.deleteMany({ where: { id: { in: teamIds } } });
      }
      await prisma.ranking.deleteMany({ where: { routeId: { in: routeIds } } });

      // Find stories/games
      const stories = await prisma.story.findMany({ where: { game: { cityId: city.id } } });
      const storyIds = stories.map((s) => s.id);
      if (storyIds.length > 0) {
        await prisma.storyEnding.deleteMany({ where: { storyId: { in: storyIds } } });
        await prisma.story.deleteMany({ where: { id: { in: storyIds } } });
      }
      const games = await prisma.game.findMany({ where: { cityId: city.id } });
      const gameIds = games.map((g) => g.id);
      if (gameIds.length > 0) {
        await prisma.game.deleteMany({ where: { id: { in: gameIds } } });
      }

      await prisma.route.deleteMany({ where: { id: { in: routeIds } } });
    }

    // Finally delete the city
    await prisma.city.delete({ where: { id: city.id } });
    console.log(`  ✅ Deleted city: ${city.name}`);
  }

  console.log('\n🧹 Cleanup complete! Now re-running seed...\n');
}

main()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

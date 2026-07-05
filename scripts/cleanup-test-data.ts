/**
 * Clean test data created during debugging
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning test cities...');
  
  // Find and delete test cities
  const testCities = await prisma.city.findMany({
    where: {
      name: { in: ['AuthTest', 'Nueva', 'Test', 'test-e2e', 'test-final'] }
    }
  });
  
  if (testCities.length === 0) {
    console.log('No test cities found.');
  }
  
  for (const city of testCities) {
    // Delete routes and related data
    const routes = await prisma.route.findMany({ where: { cityId: city.id } });
    for (const route of routes) {
      await prisma.qRCode.deleteMany({ where: { routeId: route.id } });
      const missions = await prisma.mission.findMany({ where: { routeId: route.id } });
      for (const m of missions) {
        const challenges = await prisma.challenge.findMany({ where: { missionId: m.id } });
        for (const c of challenges) {
          await prisma.challengeAnswer.deleteMany({ where: { challengeId: c.id } });
        }
        await prisma.challenge.deleteMany({ where: { missionId: m.id } });
      }
      await prisma.mission.deleteMany({ where: { routeId: route.id } });
      await prisma.checkpoint.deleteMany({ where: { routeId: route.id } });
      await prisma.ranking.deleteMany({ where: { routeId: route.id } });
      const teams = await prisma.team.findMany({ where: { routeId: route.id } });
      for (const t of teams) {
        const sessions = await prisma.gameSession.findMany({ where: { teamId: t.id } });
        for (const s of sessions) {
          await prisma.sessionEvent.deleteMany({ where: { sessionId: s.id } });
        }
        await prisma.gameSession.deleteMany({ where: { teamId: t.id } });
        await prisma.teamMember.deleteMany({ where: { teamId: t.id } });
      }
      await prisma.team.deleteMany({ where: { routeId: route.id } });
    }
    await prisma.route.deleteMany({ where: { cityId: city.id } });
    
    // Delete games
    const games = await prisma.game.findMany({ where: { cityId: city.id } });
    for (const g of games) {
      const stories = await prisma.story.findMany({ where: { gameId: g.id } });
      for (const s of stories) {
        await prisma.storyEnding.deleteMany({ where: { storyId: s.id } });
      }
      await prisma.story.deleteMany({ where: { gameId: g.id } });
    }
    await prisma.game.deleteMany({ where: { cityId: city.id } });
    
    await prisma.city.delete({ where: { id: city.id } });
    console.log(`  ✅ Deleted: ${city.name}`);
  }
  
  console.log('\n✅ Cleanup complete!');
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());

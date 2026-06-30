import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CityModule } from './city/city.module';
import { RoutesModule } from './routes/routes.module';
import { TeamsModule } from './teams/teams.module';
import { GamesModule } from './games/games.module';
import { RankingsModule } from './rankings/rankings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { GamesTemplateModule } from './games-template/games-template.module';
import { StoriesModule } from './stories/stories.module';
import { MissionsModule } from './missions/missions.module';
import { ChallengesModule } from './challenges/challenges.module';
import { UnlockKeysModule } from './unlock-keys/unlock-keys.module';
import { StoryEndingsModule } from './story-endings/story-endings.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CityModule,
    RoutesModule,
    TeamsModule,
    GamesModule,
    RankingsModule,
    NotificationsModule,
    GamesTemplateModule,
    StoriesModule,
    MissionsModule,
    ChallengesModule,
    UnlockKeysModule,
    StoryEndingsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

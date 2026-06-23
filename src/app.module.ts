import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CityModule } from './city/city.module';
import { RoutesModule } from './routes/routes.module';
import { TeamsModule } from './teams/teams.module';
import { GamesModule } from './games/games.module';
import { RankingsModule } from './rankings/rankings.module';
import { PrismaModule } from './prisma/prisma.module';

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
  ],
})
export class AppModule {}

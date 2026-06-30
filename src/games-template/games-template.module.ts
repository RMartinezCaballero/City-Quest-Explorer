import { Module } from '@nestjs/common';
import { GamesTemplateService } from './games-template.service';
import { GamesTemplateController } from './games-template.controller';

@Module({
  providers: [GamesTemplateService],
  controllers: [GamesTemplateController],
  exports: [GamesTemplateService],
})
export class GamesTemplateModule {}

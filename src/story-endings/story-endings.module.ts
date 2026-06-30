import { Module } from '@nestjs/common';
import { StoryEndingsService } from './story-endings.service';
import { StoryEndingsController } from './story-endings.controller';

@Module({
  providers: [StoryEndingsService],
  controllers: [StoryEndingsController],
  exports: [StoryEndingsService],
})
export class StoryEndingsModule {}

import { Module } from '@nestjs/common';
import { UnlockKeysService } from './unlock-keys.service';
import { UnlockKeysController } from './unlock-keys.controller';

@Module({
  providers: [UnlockKeysService],
  controllers: [UnlockKeysController],
  exports: [UnlockKeysService],
})
export class UnlockKeysModule {}

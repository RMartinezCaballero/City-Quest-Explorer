import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnlockKeysService } from './unlock-keys.service';
import { CreateUnlockKeyDto } from './dto/create-unlock-key.dto';

@ApiTags('unlock-keys')
@Controller()
export class UnlockKeysController {
  constructor(private readonly unlockKeysService: UnlockKeysService) {}

  @Post('challenges/:challengeId/keys')
  @ApiOperation({ summary: 'Crear una llave de desbloqueo para un reto' })
  create(@Param('challengeId') challengeId: string, @Body() payload: CreateUnlockKeyDto) {
    return this.unlockKeysService.create(challengeId, payload);
  }

  @Get('challenges/:challengeId/keys')
  @ApiOperation({ summary: 'Listar llaves de desbloqueo de un reto' })
  findByChallenge(@Param('challengeId') challengeId: string) {
    return this.unlockKeysService.findByChallenge(challengeId);
  }

  @Post('keys/validate')
  @ApiOperation({ summary: 'Validar una llave de desbloqueo' })
  validateKey(@Body() payload: { keyValue: string }) {
    return this.unlockKeysService.validateKey(payload.keyValue);
  }

  @Post('keys/use')
  @ApiOperation({ summary: 'Canjear (usar) una llave de desbloqueo' })
  useKey(@Body() payload: { keyValue: string }) {
    return this.unlockKeysService.useKey(payload.keyValue);
  }

  @Delete('keys/:keyId')
  @ApiOperation({ summary: 'Eliminar una llave de desbloqueo' })
  remove(@Param('keyId') keyId: string) {
    return this.unlockKeysService.remove(keyId);
  }
}

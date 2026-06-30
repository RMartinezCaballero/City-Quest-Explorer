import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('challenges')
@Controller('missions/:missionId/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un reto en una misión' })
  create(@Param('missionId') missionId: string, @Body() payload: CreateChallengeDto) {
    return this.challengesService.create(missionId, payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar retos de una misión' })
  findByMission(@Param('missionId') missionId: string) {
    return this.challengesService.findByMission(missionId);
  }

  @Get(':challengeId')
  @ApiOperation({ summary: 'Obtener reto por id' })
  findOne(@Param('challengeId') challengeId: string) {
    return this.challengesService.findOne(challengeId);
  }

  @Patch(':challengeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un reto' })
  update(@Param('challengeId') challengeId: string, @Body() payload: UpdateChallengeDto) {
    return this.challengesService.update(challengeId, payload);
  }

  @Delete(':challengeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un reto' })
  remove(@Param('challengeId') challengeId: string) {
    return this.challengesService.remove(challengeId);
  }

  @Post(':challengeId/validate')
  @ApiOperation({ summary: 'Validar una respuesta contra un reto' })
  validateAnswer(
    @Param('challengeId') challengeId: string,
    @Body() payload: { answer: string },
  ) {
    return this.challengesService.validateAnswer(challengeId, payload.answer);
  }
}

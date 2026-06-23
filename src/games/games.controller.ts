import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateSessionEventDto } from './dto/create-session-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { CreateSoloSessionDto } from './dto/create-solo-session.dto';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) { }

  @Post('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Iniciar una nueva sesión de juego (modo equipo)' })
  createSession(@Body() payload: CreateSessionDto) {
    return this.gamesService.createSession(payload);
  }

  @Post('solo/sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Iniciar una nueva sesión de juego (modo solo: crea Team con 1 miembro)' })
  createSoloSession(@User('id') userId: string, @Body() payload: CreateSoloSessionDto) {
    return this.gamesService.createSoloSession({ ...payload, userId });
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Obtener una sesión de juego por id' })
  findSession(@Param('sessionId') sessionId: string) {
    return this.gamesService.findSession(sessionId);
  }

  @Get('teams/:teamId/sessions')
  @ApiOperation({ summary: 'Listar sesiones de un equipo' })
  findByTeam(@Param('teamId') teamId: string) {
    return this.gamesService.findByTeam(teamId);
  }

  @Post('sessions/:sessionId/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar evento de sesión de juego' })
  addSessionEvent(@Param('sessionId') sessionId: string, @Body() payload: CreateSessionEventDto) {
    return this.gamesService.addSessionEvent(sessionId, payload);
  }
}


import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('teams')
@Controller('routes/:routeId/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar equipos de una ruta' })
  findByRoute(@Param('routeId') routeId: string) {
    return this.teamsService.findByRoute(routeId);
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Obtener un equipo por id' })
  findOne(@Param('teamId') teamId: string) {
    return this.teamsService.findOne(teamId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un equipo en una ruta' })
  create(@Param('routeId') routeId: string, @Body() payload: CreateTeamDto) {
    return this.teamsService.create({ ...payload, routeId });
  }
}

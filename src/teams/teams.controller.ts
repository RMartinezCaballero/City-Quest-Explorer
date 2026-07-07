import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

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
  findOne(@Param('routeId') routeId: string, @Param('teamId') teamId: string) {
    return this.teamsService.findOne(teamId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un equipo en una ruta' })
  create(@Param('routeId') routeId: string, @Body() payload: CreateTeamDto) {
    return this.teamsService.create({ ...payload, routeId });
  }

  @Patch(':teamId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar equipo' })
  update(@Param('routeId') routeId: string, @Param('teamId') teamId: string, @Body() payload: Partial<CreateTeamDto>) {
    return this.teamsService.update(teamId, payload);
  }

  @Delete(':teamId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar equipo' })
  remove(@Param('routeId') routeId: string, @Param('teamId') teamId: string) {
    return this.teamsService.remove(teamId);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('missions')
@Controller('routes/:routeId/missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una misión en una ruta' })
  create(@Param('routeId') routeId: string, @Body() payload: CreateMissionDto) {
    return this.missionsService.create(routeId, payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar misiones de una ruta (ordenadas)' })
  findByRoute(@Param('routeId') routeId: string) {
    return this.missionsService.findByRoute(routeId);
  }

  @Get(':missionId')
  @ApiOperation({ summary: 'Obtener misión por id con retos' })
  findOne(@Param('missionId') missionId: string) {
    return this.missionsService.findOne(missionId);
  }

  @Patch(':missionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una misión' })
  update(@Param('missionId') missionId: string, @Body() payload: UpdateMissionDto) {
    return this.missionsService.update(missionId, payload);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reordenar misiones (drag & drop)' })
  reorder(@Param('routeId') routeId: string, @Body() payload: { missionIds: string[] }) {
    return this.missionsService.reorder(routeId, payload.missionIds);
  }

  @Delete(':missionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una misión' })
  remove(@Param('missionId') missionId: string) {
    return this.missionsService.remove(missionId);
  }
}

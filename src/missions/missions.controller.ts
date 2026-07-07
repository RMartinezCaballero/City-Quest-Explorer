import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@ApiTags('missions')
@Controller('routes/:routeId/missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
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
  @ApiOperation({ summary: 'Actualizar una misión' })
  update(@Param('missionId') missionId: string, @Body() payload: UpdateMissionDto) {
    return this.missionsService.update(missionId, payload);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reordenar misiones (drag & drop)' })
  reorder(@Param('routeId') routeId: string, @Body() payload: { missionIds: string[] }) {
    return this.missionsService.reorder(routeId, payload.missionIds);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincronizar misiones activas de una ruta por ids' })
  sync(@Param('routeId') routeId: string, @Body() payload: { missionIds: string[] }) {
    return this.missionsService.syncByRoute(routeId, payload.missionIds ?? []);
  }

  @Delete(':missionId')
  @ApiOperation({ summary: 'Eliminar una misión' })
  remove(@Param('missionId') missionId: string) {
    return this.missionsService.remove(missionId);
  }
}

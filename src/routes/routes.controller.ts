import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiBearerAuth()
@ApiTags('routes')
@Controller()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // ── Backward-compatible endpoints (preservados del MVP anterior) ──
  @Get('cities/:cityId/routes')
  @ApiOperation({ summary: 'Listar rutas de una ciudad (BC), opcional filtro por dificultad' })
  findByCity(@Param('cityId') cityId: string, @Query('difficulty') difficulty?: string) {
    return this.routesService.findByCity(cityId, difficulty);
  }

  @Get('cities/:cityId/routes/:routeId')
  @ApiOperation({ summary: 'Obtener ruta por id (BC)' })
  findOneByCity(@Param('routeId') routeId: string) {
    return this.routesService.findOne(routeId);
  }

  @Post('cities/:cityId/routes')
  @ApiOperation({ summary: 'Crear ruta en ciudad (BC) - requiere storyId en body' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  createByCity(@Param('cityId') cityId: string, @Body() payload: CreateRouteDto & { storyId: string }) {
    return this.routesService.create(payload.storyId, cityId, payload);
  }

  // ── Nuevos endpoints con jerarquía Story ──
  @Get('routes/:routeId')
  @ApiOperation({ summary: 'Obtener ruta por id' })
  findOne(@Param('routeId') routeId: string) {
    return this.routesService.findOne(routeId);
  }

  @Get('stories/:storyId/routes')
  @ApiOperation({ summary: 'Listar rutas de una historia' })
  findByStory(@Param('storyId') storyId: string) {
    return this.routesService.findByStory(storyId);
  }

  @Post('stories/:storyId/cities/:cityId/routes')
  @ApiOperation({ summary: 'Crear una ruta en una historia' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Param('storyId') storyId: string, @Param('cityId') cityId: string, @Body() payload: CreateRouteDto) {
    return this.routesService.create(storyId, cityId, payload);
  }

  @Patch('routes/:routeId')
  @ApiOperation({ summary: 'Actualizar una ruta' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('routeId') routeId: string, @Body() payload: Partial<CreateRouteDto>) {
    return this.routesService.update(routeId, payload);
  }

  @Delete('routes/:routeId')
  @ApiOperation({ summary: 'Eliminar una ruta' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('routeId') routeId: string) {
    return this.routesService.remove(routeId);
  }

  @Post('routes/:routeId/missions/generate')
  @ApiOperation({ summary: 'Generar automáticamente misiones placeholder según el missionCount de la ruta' })
  @UseGuards(JwtAuthGuard, AdminGuard)
  generateMissions(@Param('routeId') routeId: string) {
    return this.routesService.generateMissions(routeId);
  }
}

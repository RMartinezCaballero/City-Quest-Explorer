import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';

@ApiTags('routes')
@Controller()
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // ── Backward-compatible endpoints (preservados del MVP anterior) ──
  @Get('cities/:cityId/routes')
  @ApiOperation({ summary: 'Listar rutas de una ciudad (BC)' })
  findByCity(@Param('cityId') cityId: string) {
    return this.routesService.findByCity(cityId);
  }

  @Get('cities/:cityId/routes/:routeId')
  @ApiOperation({ summary: 'Obtener ruta por id (BC)' })
  findOneByCity(@Param('routeId') routeId: string) {
    return this.routesService.findOne(routeId);
  }

  @Post('cities/:cityId/routes')
  @ApiOperation({ summary: 'Crear ruta en ciudad (BC) - requiere storyId en body' })
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
  create(@Param('storyId') storyId: string, @Param('cityId') cityId: string, @Body() payload: CreateRouteDto) {
    return this.routesService.create(storyId, cityId, payload);
  }

  @Patch('routes/:routeId')
  @ApiOperation({ summary: 'Actualizar una ruta' })
  update(@Param('routeId') routeId: string, @Body() payload: Partial<CreateRouteDto>) {
    return this.routesService.update(routeId, payload);
  }

  @Delete('routes/:routeId')
  @ApiOperation({ summary: 'Eliminar una ruta' })
  remove(@Param('routeId') routeId: string) {
    return this.routesService.remove(routeId);
  }
}

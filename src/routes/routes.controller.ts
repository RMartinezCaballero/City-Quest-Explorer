import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('routes')
@Controller('cities/:cityId/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar rutas de una ciudad' })
  findByCity(@Param('cityId') cityId: string) {
    return this.routesService.findByCity(cityId);
  }

  @Get(':routeId')
  @ApiOperation({ summary: 'Obtener ruta por id' })
  findOne(@Param('routeId') routeId: string) {
    return this.routesService.findOne(routeId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una ruta en una ciudad' })
  create(@Param('cityId') cityId: string, @Body() payload: CreateRouteDto) {
    return this.routesService.create(cityId, payload);
  }
}

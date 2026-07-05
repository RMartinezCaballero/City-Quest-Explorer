import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Listar ciudades disponibles' })
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ciudad por id' })
  findOne(@Param('id') id: string) {
    return this.cityService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una ciudad' })
  create(@Body() payload: CreateCityDto) {
    return this.cityService.create(payload);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  update(@Param('id') id: string, @Body() payload: Partial<CreateCityDto>) {
    return this.cityService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}

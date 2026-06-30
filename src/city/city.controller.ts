import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';

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
  @ApiOperation({ summary: 'Crear una ciudad' })
  create(@Body() payload: CreateCityDto) {
    return this.cityService.create(payload);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  update(@Param('id') id: string, @Body() payload: Partial<CreateCityDto>) {
    return this.cityService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}

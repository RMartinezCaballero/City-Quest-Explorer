import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GamesTemplateService } from './games-template.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@ApiTags('games-template')
@Controller('cities/:cityId/games')
export class GamesTemplateController {
  constructor(private readonly gamesService: GamesTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un juego (template) en una ciudad' })
  create(@Param('cityId') cityId: string, @Body() payload: CreateGameDto) {
    return this.gamesService.create(cityId, payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar juegos de una ciudad' })
  findAll(@Param('cityId') cityId: string) {
    return this.gamesService.findAll(cityId);
  }

  @Get(':gameId')
  @ApiOperation({ summary: 'Obtener juego por id con sus historias' })
  findOne(@Param('gameId') gameId: string) {
    return this.gamesService.findOne(gameId);
  }

  @Patch(':gameId')
  @ApiOperation({ summary: 'Actualizar un juego' })
  update(@Param('gameId') gameId: string, @Body() payload: UpdateGameDto) {
    return this.gamesService.update(gameId, payload);
  }

  @Post(':gameId/publish')
  @ApiOperation({ summary: 'Publicar/Despublicar un juego' })
  publish(@Param('gameId') gameId: string) {
    return this.gamesService.publish(gameId);
  }

  @Post(':gameId/clone')
  @ApiOperation({ summary: 'Clonar un juego completo con todas sus historias, rutas y misiones' })
  clone(@Param('gameId') gameId: string) {
    return this.gamesService.clone(gameId);
  }

  @Delete(':gameId')
  @ApiOperation({ summary: 'Eliminar un juego' })
  remove(@Param('gameId') gameId: string) {
    return this.gamesService.remove(gameId);
  }
}

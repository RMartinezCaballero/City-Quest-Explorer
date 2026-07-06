import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GamesTemplateService } from './games-template.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiBearerAuth()
@ApiTags('games-template')
@Controller('cities/:cityId/games')
export class GamesTemplateController {
  constructor(private readonly gamesService: GamesTemplateService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar un juego' })
  update(@Param('gameId') gameId: string, @Body() payload: UpdateGameDto) {
    return this.gamesService.update(gameId, payload);
  }

  @Post(':gameId/publish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Publicar/Despublicar un juego' })
  publish(@Param('gameId') gameId: string) {
    return this.gamesService.publish(gameId);
  }

  @Post(':gameId/clone')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Clonar un juego completo con todas sus historias, rutas y misiones' })
  clone(@Param('gameId') gameId: string) {
    return this.gamesService.clone(gameId);
  }

  @Delete(':gameId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Eliminar un juego' })
  remove(@Param('gameId') gameId: string) {
    return this.gamesService.remove(gameId);
  }

  @Post(':gameId/routes/generate')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Garantiza 3 rutas por dificultad para el juego y devuelve el resumen' })
  async ensureGameRoutes(@Param('gameId') gameId: string) {
    return this.gamesService.ensureGameRoutes(gameId);
  }

  @Get(':gameId/routes/playable')
  @ApiOperation({ summary: 'Lista rutas jugables del juego, opcionalmente filtradas por dificultad' })
  listPlayableRoutes(@Param('gameId') gameId: string, @Query('difficulty') difficulty?: string) {
    return this.gamesService.listPlayableRoutes(gameId, difficulty);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('stories')
@Controller('games/:gameId/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una historia en un juego' })
  create(@Param('gameId') gameId: string, @Body() payload: CreateStoryDto) {
    return this.storiesService.create(gameId, payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar historias de un juego' })
  findByGame(@Param('gameId') gameId: string) {
    return this.storiesService.findByGame(gameId);
  }

  @Get(':storyId')
  @ApiOperation({ summary: 'Obtener historia por id con rutas y misiones' })
  findOne(@Param('storyId') storyId: string) {
    return this.storiesService.findOne(storyId);
  }

  @Patch(':storyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una historia' })
  update(@Param('storyId') storyId: string, @Body() payload: UpdateStoryDto) {
    return this.storiesService.update(storyId, payload);
  }

  @Post(':storyId/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar/Despublicar una historia' })
  publish(@Param('storyId') storyId: string) {
    return this.storiesService.publish(storyId);
  }

  @Delete(':storyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una historia' })
  remove(@Param('storyId') storyId: string) {
    return this.storiesService.remove(storyId);
  }
}

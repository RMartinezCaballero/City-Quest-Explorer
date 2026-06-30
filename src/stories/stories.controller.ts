import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@ApiTags('stories')
@Controller('games/:gameId/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
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
  @ApiOperation({ summary: 'Actualizar una historia' })
  update(@Param('storyId') storyId: string, @Body() payload: UpdateStoryDto) {
    return this.storiesService.update(storyId, payload);
  }

  @Post(':storyId/publish')
  @ApiOperation({ summary: 'Publicar/Despublicar una historia' })
  publish(@Param('storyId') storyId: string) {
    return this.storiesService.publish(storyId);
  }

  @Delete(':storyId')
  @ApiOperation({ summary: 'Eliminar una historia' })
  remove(@Param('storyId') storyId: string) {
    return this.storiesService.remove(storyId);
  }
}

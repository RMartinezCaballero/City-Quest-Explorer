import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoryEndingsService } from './story-endings.service';
import { CreateStoryEndingDto } from './dto/create-story-ending.dto';
import { UpdateStoryEndingDto } from './dto/update-story-ending.dto';

@ApiTags('story-endings')
@Controller('stories/:storyId/endings')
export class StoryEndingsController {
  constructor(private readonly endingsService: StoryEndingsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un final alternativo para una historia' })
  create(@Param('storyId') storyId: string, @Body() payload: CreateStoryEndingDto) {
    return this.endingsService.create(storyId, payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar finales de una historia' })
  findByStory(@Param('storyId') storyId: string) {
    return this.endingsService.findByStory(storyId);
  }

  @Get(':endingId')
  @ApiOperation({ summary: 'Obtener final por id' })
  findOne(@Param('endingId') endingId: string) {
    return this.endingsService.findOne(endingId);
  }

  @Patch(':endingId')
  @ApiOperation({ summary: 'Actualizar un final' })
  update(@Param('endingId') endingId: string, @Body() payload: UpdateStoryEndingDto) {
    return this.endingsService.update(endingId, payload);
  }

  @Delete(':endingId')
  @ApiOperation({ summary: 'Eliminar un final' })
  remove(@Param('endingId') endingId: string) {
    return this.endingsService.remove(endingId);
  }
}

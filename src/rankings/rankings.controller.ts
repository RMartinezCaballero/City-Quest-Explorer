import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('rankings')
@Controller('routes/:routeId/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener ranking de una ruta' })
  findByRoute(@Param('routeId') routeId: string) {
    return this.rankingsService.findByRoute(routeId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar o actualizar un ranking para una ruta' })
  create(@Param('routeId') routeId: string, @Body() payload: CreateRankingDto) {
    return this.rankingsService.create({ ...payload, routeId });
  }
}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CityService } from './city.service';
import { CityController } from './city.controller';

@Module({
  imports: [PassportModule],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ example: 'Buenos Aires' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'buenos-aires' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Argentina' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

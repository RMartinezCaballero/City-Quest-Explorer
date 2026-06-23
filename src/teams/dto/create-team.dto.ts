import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Exploradores del centro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'cb2d8a89-554e-4a81-a1d3-9b7d7bd3e098' })
  @IsString()
  @IsNotEmpty()
  captainId: string;
}

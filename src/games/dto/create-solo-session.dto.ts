import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSoloSessionDto {
    @ApiProperty({ example: 'd1fb8eab-9c93-4b76-94bd-2b8e4b8ae064' })
    @IsString()
    @IsNotEmpty()
    routeId: string;

    @ApiProperty({ example: '15a6c7a8-ccdd-4fff-a8d1-57a5d8e2b7d0' })
    @IsString()
    @IsNotEmpty()
    cityId: string;
}


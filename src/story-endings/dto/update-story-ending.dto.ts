import { PartialType } from '@nestjs/swagger';
import { CreateStoryEndingDto } from './create-story-ending.dto';

export class UpdateStoryEndingDto extends PartialType(CreateStoryEndingDto) {}

import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MoodLevel {
  VERY_BAD = 'VERY_BAD',
  BAD = 'BAD',
  NEUTRAL = 'NEUTRAL',
  GOOD = 'GOOD',
  VERY_GOOD = 'VERY_GOOD',
}

export class CreateMoodDto {
  @ApiProperty({ enum: MoodLevel, example: 'GOOD' })
  @IsEnum(MoodLevel)
  mood: MoodLevel;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  energy: number;

  @ApiProperty({ required: false, example: 'Feeling productive today!' })
  @IsString()
  @IsOptional()
  notes?: string;
}

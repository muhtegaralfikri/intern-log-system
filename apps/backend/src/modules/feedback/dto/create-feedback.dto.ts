import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'uuid-activity-id' })
  @IsUUID()
  @IsNotEmpty()
  activityId: string;

  @ApiProperty({ example: 'uuid-receiver-id' })
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ required: false, example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'Great work on this task!' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}

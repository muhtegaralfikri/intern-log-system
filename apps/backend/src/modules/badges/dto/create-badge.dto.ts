import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBadgeDto {
  @ApiProperty({ example: '7-Day Streak' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Isi log 7 hari berturut-turut' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '🔥' })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: '{"type": "streak", "days": 7}' })
  @IsString()
  @IsNotEmpty()
  condition: string;
}

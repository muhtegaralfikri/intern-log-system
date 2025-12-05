import { IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'Mengembangkan fitur login' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Membuat halaman login dengan validasi form' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Development' })
  @IsString()
  category: string;

  @ApiProperty({ example: 120, description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  @IsDateString()
  date: string;
}

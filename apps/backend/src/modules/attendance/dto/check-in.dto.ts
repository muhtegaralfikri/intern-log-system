import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({ description: 'Base64 encoded photo or URL', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: -6.2088, description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 106.8456, description: 'Longitude' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'Jl. Sudirman No. 1, Jakarta', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CheckOutDto {
  @ApiProperty({ description: 'Base64 encoded photo or URL', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: -6.2088, description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 106.8456, description: 'Longitude' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'Jl. Sudirman No. 1, Jakarta', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

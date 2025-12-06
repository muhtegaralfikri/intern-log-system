import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({ example: 'screenshot.png' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'https://cloudinary.com/...' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({ example: 102400 })
  @IsNumber()
  fileSize: number;
}

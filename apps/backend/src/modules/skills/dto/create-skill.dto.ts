import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Frontend' })
  @IsString()
  @IsNotEmpty()
  category: string;
}

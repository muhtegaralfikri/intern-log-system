import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@ApiTags('Skills')
@Controller('skills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new skill' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get('my-progress')
  @ApiOperation({ summary: 'Get current user skill progress' })
  getMyProgress(@Request() req) {
    return this.skillsService.getUserProgress(req.user.id);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get skill analytics for current user' })
  getAnalytics(@Request() req) {
    return this.skillsService.getAnalytics(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by id' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@ApiTags('Mood')
@Controller('mood')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MoodController {
  constructor(private moodService: MoodService) {}

  @Post()
  @ApiOperation({ summary: 'Log mood entry for today' })
  create(@Request() req, @Body() dto: CreateMoodDto) {
    return this.moodService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get mood history' })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.moodService.findAll(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 30,
    );
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today mood entry' })
  getToday(@Request() req) {
    return this.moodService.getToday(req.user.id);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get mood analytics' })
  getAnalytics(@Request() req, @Query('days') days?: string) {
    return this.moodService.getAnalytics(
      req.user.id,
      days ? parseInt(days) : 30,
    );
  }
}

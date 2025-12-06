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
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';

@ApiTags('Badges')
@Controller('badges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BadgesController {
  constructor(private badgesService: BadgesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new badge' })
  create(@Body() dto: CreateBadgeDto) {
    return this.badgesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all badges' })
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('my-badges')
  @ApiOperation({ summary: 'Get current user earned badges' })
  getMyBadges(@Request() req) {
    return this.badgesService.getUserBadges(req.user.id);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check and award badges for current user' })
  checkBadges(@Request() req) {
    return this.badgesService.checkAndAwardBadges(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get badge by id' })
  findOne(@Param('id') id: string) {
    return this.badgesService.findOne(id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default badges' })
  seedBadges() {
    return this.badgesService.seedDefaultBadges();
  }
}

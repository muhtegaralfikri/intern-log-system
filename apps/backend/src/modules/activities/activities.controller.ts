import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@ApiTags('Activities')
@Controller('activities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new activity' })
  create(@Request() req, @Body() dto: CreateActivityDto) {
    return this.activitiesService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activitiesService.findAll(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by id' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.activitiesService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  remove(@Request() req, @Param('id') id: string) {
    return this.activitiesService.remove(id, req.user.id);
  }
}

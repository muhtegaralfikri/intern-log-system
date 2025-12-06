import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('Feedback')
@Controller('feedback')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Give feedback on an activity' })
  create(@Request() req, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(req.user.id, dto);
  }

  @Get('received')
  @ApiOperation({ summary: 'Get received feedback' })
  getReceived(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.feedbackService.getReceived(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('given')
  @ApiOperation({ summary: 'Get given feedback' })
  getGiven(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.feedbackService.getGiven(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get feedback statistics' })
  getStats(@Request() req) {
    return this.feedbackService.getStats(req.user.id);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Get feedback for an activity' })
  getByActivity(@Param('activityId') activityId: string) {
    return this.feedbackService.getByActivity(activityId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback' })
  remove(@Request() req, @Param('id') id: string) {
    return this.feedbackService.remove(id, req.user.id);
  }
}

import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
  ) {}

  @Post('summarize')
  @ApiOperation({ summary: 'Summarize activities using AI' })
  async summarize(@Request() req, @Body() body: { startDate: string; endDate: string }) {
    const activities = await this.prisma.activity.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(body.startDate),
          lte: new Date(body.endDate),
        },
      },
      orderBy: { date: 'asc' },
    });

    const summary = await this.aiService.summarizeActivities(activities);
    return { summary };
  }

  @Post('weekly-report')
  @ApiOperation({ summary: 'Generate weekly report using AI' })
  async generateWeeklyReport(@Request() req, @Body() body: { startDate: string; endDate: string }) {
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    const activities = await this.prisma.activity.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const report = await this.aiService.generateWeeklyReport(activities, startDate, endDate);
    return { report };
  }

  @Get('suggest-tasks')
  @ApiOperation({ summary: 'Get AI task suggestions based on skills' })
  async suggestTasks(@Request() req) {
    const [userSkills, recentActivities] = await Promise.all([
      this.prisma.userSkill.findMany({
        where: { userId: req.user.id },
        include: { skill: true },
      }),
      this.prisma.activity.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const suggestions = await this.aiService.suggestTasks(userSkills, recentActivities);
    return { suggestions };
  }

  @Get('daily-prompt')
  @ApiOperation({ summary: 'Get daily prompts for activity logging' })
  async getDailyPrompts() {
    const prompts = await this.aiService.getDailyPrompts();
    return { prompts };
  }

  @Post('reflection')
  @ApiOperation({ summary: 'Generate weekly reflection questions' })
  async generateReflection(@Request() req) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const activities = await this.prisma.activity.findMany({
      where: {
        userId: req.user.id,
        date: { gte: oneWeekAgo },
      },
    });

    const questions = await this.aiService.generateReflectionQuestions(activities);
    return { questions };
  }
}

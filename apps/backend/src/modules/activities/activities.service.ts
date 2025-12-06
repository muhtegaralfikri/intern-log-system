import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        duration: dto.duration,
        date: new Date(dto.date),
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activity.count({ where: { userId } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    return this.prisma.activity.findFirst({
      where: { id, userId },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.activity.deleteMany({
      where: { id, userId },
    });
  }

  async addAttachment(
    activityId: string,
    userId: string,
    dto: CreateAttachmentDto,
  ) {
    const activity = await this.prisma.activity.findFirst({
      where: { id: activityId, userId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return this.prisma.attachment.create({
      data: {
        activityId,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        fileType: dto.fileType,
        fileSize: dto.fileSize,
      },
    });
  }

  async getAttachments(activityId: string) {
    return this.prisma.attachment.findMany({
      where: { activityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeAttachment(attachmentId: string, userId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: { activity: true },
    });

    if (!attachment || attachment.activity.userId !== userId) {
      throw new NotFoundException('Attachment not found');
    }

    return this.prisma.attachment.delete({
      where: { id: attachmentId },
    });
  }

  async getAnalytics(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.prisma.activity.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
    });

    const byCategory = activities.reduce(
      (acc, a) => {
        if (!acc[a.category]) acc[a.category] = { count: 0, minutes: 0 };
        acc[a.category].count += 1;
        acc[a.category].minutes += a.duration;
        return acc;
      },
      {} as Record<string, { count: number; minutes: number }>,
    );

    const byDate = activities.reduce(
      (acc, a) => {
        const date = new Date(a.date).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = { count: 0, minutes: 0 };
        acc[date].count += 1;
        acc[date].minutes += a.duration;
        return acc;
      },
      {} as Record<string, { count: number; minutes: number }>,
    );

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);

    const hourlyDistribution = activities.reduce(
      (acc, a) => {
        const hour = new Date(a.createdAt).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const peakHour = Object.entries(hourlyDistribution).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return {
      totalActivities: activities.length,
      totalMinutes,
      totalHours: Math.floor(totalMinutes / 60),
      avgMinutesPerDay: Math.round(totalMinutes / days),
      byCategory: Object.entries(byCategory).map(([category, data]) => ({
        category,
        ...data,
        hours: Math.round((data.minutes / 60) * 10) / 10,
      })),
      dailyTrend: Object.entries(byDate)
        .map(([date, data]) => ({
          date,
          ...data,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      peakHour: peakHour ? parseInt(peakHour[0]) : null,
    };
  }
}

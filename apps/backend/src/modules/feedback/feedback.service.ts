import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(giverId: string, dto: CreateFeedbackDto) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: dto.activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return this.prisma.feedback.create({
      data: {
        activityId: dto.activityId,
        giverId,
        receiverId: dto.receiverId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        giver: { select: { id: true, name: true, avatarUrl: true } },
        activity: { select: { id: true, title: true } },
      },
    });
  }

  async getReceived(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: { receiverId: userId },
        include: {
          giver: { select: { id: true, name: true, avatarUrl: true } },
          activity: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.feedback.count({ where: { receiverId: userId } }),
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

  async getGiven(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: { giverId: userId },
        include: {
          receiver: { select: { id: true, name: true, avatarUrl: true } },
          activity: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.feedback.count({ where: { giverId: userId } }),
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

  async getByActivity(activityId: string) {
    return this.prisma.feedback.findMany({
      where: { activityId },
      include: {
        giver: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (feedback.giverId !== userId) {
      throw new ForbiddenException('You can only delete your own feedback');
    }

    return this.prisma.feedback.delete({
      where: { id },
    });
  }

  async getStats(userId: string) {
    const received = await this.prisma.feedback.findMany({
      where: { receiverId: userId },
    });

    const avgRating =
      received.filter((f) => f.rating).length > 0
        ? received
            .filter((f) => f.rating)
            .reduce((sum, f) => sum + (f.rating || 0), 0) /
          received.filter((f) => f.rating).length
        : 0;

    return {
      totalReceived: received.length,
      totalGiven: await this.prisma.feedback.count({
        where: { giverId: userId },
      }),
      avgRating: Math.round(avgRating * 10) / 10,
      ratingDistribution: [1, 2, 3, 4, 5].map((r) => ({
        rating: r,
        count: received.filter((f) => f.rating === r).length,
      })),
    };
  }
}

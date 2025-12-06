import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBadgeDto) {
    return this.prisma.badge.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.badge.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.badge.findUnique({
      where: { id },
    });
  }

  async getUserBadges(userId: string) {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });

    return userBadges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      earnedAt: ub.earnedAt,
    }));
  }

  async checkAndAwardBadges(userId: string) {
    const badges = await this.prisma.badge.findMany();
    const awarded: string[] = [];

    for (const badge of badges) {
      const hasEarned = await this.prisma.userBadge.findUnique({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
      });

      if (hasEarned) continue;

      const condition = JSON.parse(badge.condition);
      const earned = await this.checkCondition(userId, condition);

      if (earned) {
        await this.prisma.userBadge.create({
          data: { userId, badgeId: badge.id },
        });
        awarded.push(badge.name);
      }
    }

    return awarded;
  }

  private async checkCondition(
    userId: string,
    condition: { type: string; [key: string]: unknown },
  ): Promise<boolean> {
    switch (condition.type) {
      case 'streak': {
        const days = (condition.days as number) || 7;
        return this.checkStreak(userId, days);
      }
      case 'early_bird': {
        return this.checkEarlyBird(userId);
      }
      case 'productive_week': {
        const hours = (condition.hours as number) || 40;
        return this.checkProductiveWeek(userId, hours);
      }
      case 'task_master': {
        const count = (condition.count as number) || 50;
        return this.checkTaskCount(userId, count);
      }
      default:
        return false;
    }
  }

  private async checkStreak(userId: string, days: number): Promise<boolean> {
    const activities = await this.prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: days,
    });

    if (activities.length < days) return false;

    const dates = activities.map(
      (a) => new Date(a.date).toISOString().split('T')[0],
    );
    const uniqueDates = [...new Set(dates)];

    return uniqueDates.length >= days;
  }

  private async checkEarlyBird(userId: string): Promise<boolean> {
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        checkIn: { not: null },
      },
      orderBy: { date: 'desc' },
    });

    if (!attendance?.checkIn) return false;
    const hour = new Date(attendance.checkIn).getHours();
    return hour < 8;
  }

  private async checkProductiveWeek(
    userId: string,
    hours: number,
  ): Promise<boolean> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const activities = await this.prisma.activity.findMany({
      where: {
        userId,
        date: { gte: oneWeekAgo },
      },
    });

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
    return totalMinutes >= hours * 60;
  }

  private async checkTaskCount(
    userId: string,
    count: number,
  ): Promise<boolean> {
    const total = await this.prisma.activity.count({
      where: { userId },
    });
    return total >= count;
  }

  async seedDefaultBadges() {
    const defaultBadges = [
      {
        name: '7-Day Streak',
        description: 'Isi log 7 hari berturut-turut',
        icon: '🔥',
        condition: JSON.stringify({ type: 'streak', days: 7 }),
      },
      {
        name: 'Early Bird',
        description: 'Check-in sebelum jam 8 pagi',
        icon: '⚡',
        condition: JSON.stringify({ type: 'early_bird' }),
      },
      {
        name: 'Productive Week',
        description: 'Lebih dari 40 jam kerja dalam seminggu',
        icon: '📝',
        condition: JSON.stringify({ type: 'productive_week', hours: 40 }),
      },
      {
        name: 'Task Master',
        description: 'Selesaikan 50 task',
        icon: '🎯',
        condition: JSON.stringify({ type: 'task_master', count: 50 }),
      },
    ];

    for (const badge of defaultBadges) {
      await this.prisma.badge.upsert({
        where: { name: badge.name },
        create: badge,
        update: badge,
      });
    }
  }
}

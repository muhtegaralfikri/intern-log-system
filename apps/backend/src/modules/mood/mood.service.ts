import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Injectable()
export class MoodService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMoodDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.moodEntry.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (existing) {
      return this.prisma.moodEntry.update({
        where: { id: existing.id },
        data: {
          mood: dto.mood,
          energy: dto.energy,
          notes: dto.notes,
        },
      });
    }

    return this.prisma.moodEntry.create({
      data: {
        userId,
        date: today,
        mood: dto.mood,
        energy: dto.energy,
        notes: dto.notes,
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 30) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.moodEntry.count({ where: { userId } }),
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

  async getToday(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.moodEntry.findUnique({
      where: { userId_date: { userId, date: today } },
    });
  }

  async getAnalytics(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await this.prisma.moodEntry.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const moodValues = {
      VERY_BAD: 1,
      BAD: 2,
      NEUTRAL: 3,
      GOOD: 4,
      VERY_GOOD: 5,
    };

    const moodDistribution = moods.reduce(
      (acc, m) => {
        acc[m.mood] = (acc[m.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const avgMood =
      moods.length > 0
        ? moods.reduce((sum, m) => sum + moodValues[m.mood], 0) / moods.length
        : 0;

    const avgEnergy =
      moods.length > 0
        ? moods.reduce((sum, m) => sum + m.energy, 0) / moods.length
        : 0;

    const activities = await this.prisma.activity.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
    });

    const productivityByMood = moods.map((m) => {
      const dayActivities = activities.filter(
        (a) =>
          new Date(a.date).toDateString() === new Date(m.date).toDateString(),
      );
      const totalMinutes = dayActivities.reduce(
        (sum, a) => sum + a.duration,
        0,
      );
      return {
        date: m.date,
        mood: m.mood,
        energy: m.energy,
        productivity: totalMinutes,
      };
    });

    return {
      totalEntries: moods.length,
      avgMood: Math.round(avgMood * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      moodDistribution,
      trend: moods.map((m) => ({
        date: m.date,
        mood: moodValues[m.mood],
        energy: m.energy,
      })),
      productivityCorrelation: productivityByMood,
    };
  }
}

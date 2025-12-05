import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

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
}

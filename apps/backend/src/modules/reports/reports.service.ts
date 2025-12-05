import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where: { userId } }),
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
    return this.prisma.report.findFirst({
      where: { id, userId },
    });
  }

  async create(
    userId: string,
    data: {
      title: string;
      content: string;
      type: string;
      periodStart: Date;
      periodEnd: Date;
      aiSummary?: string;
    },
  ) {
    return this.prisma.report.create({
      data: {
        userId,
        ...data,
      },
    });
  }
}

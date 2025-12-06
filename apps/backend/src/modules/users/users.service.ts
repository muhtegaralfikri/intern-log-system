import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          department: true,
          avatarUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatarUrl: true,
        supervisorId: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatarUrl: true,
      },
    });
  }

  async getInterns(supervisorId: string) {
    return this.prisma.user.findMany({
      where: { supervisorId },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  async assignSupervisor(internId: string, supervisorId: string) {
    return this.prisma.user.update({
      where: { id: internId },
      data: { supervisorId },
    });
  }
}

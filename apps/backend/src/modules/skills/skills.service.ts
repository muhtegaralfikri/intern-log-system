import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        name: dto.name,
        category: dto.category,
      },
    });
  }

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.skill.findUnique({
      where: { id },
      include: { userSkills: true },
    });
  }

  async getUserProgress(userId: string) {
    const userSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { level: 'desc' },
    });

    const totalHours = userSkills.reduce((sum, us) => sum + us.hours, 0);

    return {
      skills: userSkills.map((us) => ({
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category,
        level: us.level,
        hours: us.hours,
      })),
      totalHours,
      totalSkills: userSkills.length,
    };
  }

  async getAnalytics(userId: string) {
    const userSkills = await this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    const byCategory = userSkills.reduce(
      (acc, us) => {
        const cat = us.skill.category;
        if (!acc[cat]) acc[cat] = { hours: 0, count: 0 };
        acc[cat].hours += us.hours;
        acc[cat].count += 1;
        return acc;
      },
      {} as Record<string, { hours: number; count: number }>,
    );

    const topSkills = [...userSkills]
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5)
      .map((us) => ({
        name: us.skill.name,
        hours: us.hours,
        level: us.level,
      }));

    return {
      byCategory,
      topSkills,
      radarData: userSkills.map((us) => ({
        skill: us.skill.name,
        value: us.level,
      })),
    };
  }

  async updateUserSkill(userId: string, skillId: string, hours: number) {
    const existing = await this.prisma.userSkill.findUnique({
      where: { userId_skillId: { userId, skillId } },
    });

    const newHours = (existing?.hours || 0) + hours;
    const newLevel = Math.min(100, Math.floor(newHours / 10));

    return this.prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      create: {
        userId,
        skillId,
        hours,
        level: newLevel,
      },
      update: {
        hours: newHours,
        level: newLevel,
      },
    });
  }
}

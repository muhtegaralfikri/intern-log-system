import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(page = 1, limit = 10, role?: string) {
    const skip = (page - 1) * limit;
    const where = role
      ? { role: role as 'INTERN' | 'SUPERVISOR' | 'ADMIN' }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          department: true,
          avatarUrl: true,
          supervisorId: true,
          supervisor: { select: { id: true, name: true } },
          createdAt: true,
          _count: {
            select: {
              activities: true,
              attendances: true,
              reports: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
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

  async getInterns(supervisorId?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { role: 'INTERN' };
    if (supervisorId) {
      where.supervisorId = supervisorId;
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          department: true,
          avatarUrl: true,
          supervisor: { select: { id: true, name: true } },
          createdAt: true,
          _count: {
            select: {
              activities: true,
              attendances: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
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

  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [
      totalUsers,
      totalInterns,
      totalSupervisors,
      totalActivities,
      monthlyActivities,
      weeklyActivities,
      totalReports,
      pendingReports,
      todayAttendance,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'INTERN' } }),
      this.prisma.user.count({ where: { role: 'SUPERVISOR' } }),
      this.prisma.activity.count(),
      this.prisma.activity.count({
        where: { date: { gte: startOfMonth } },
      }),
      this.prisma.activity.count({
        where: { date: { gte: startOfWeek } },
      }),
      this.prisma.report.count(),
      this.prisma.report.count({ where: { isApproved: false } }),
      this.prisma.attendance.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const topInterns = await this.prisma.user.findMany({
      where: { role: 'INTERN' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        _count: { select: { activities: true } },
      },
      orderBy: { activities: { _count: 'desc' } },
      take: 5,
    });

    const activityByCategory = await this.prisma.activity.groupBy({
      by: ['category'],
      _count: { id: true },
      _sum: { duration: true },
    });

    return {
      users: {
        total: totalUsers,
        interns: totalInterns,
        supervisors: totalSupervisors,
        admins: totalUsers - totalInterns - totalSupervisors,
      },
      activities: {
        total: totalActivities,
        monthly: monthlyActivities,
        weekly: weeklyActivities,
        byCategory: activityByCategory.map((c) => ({
          category: c.category,
          count: c._count.id,
          totalMinutes: c._sum.duration || 0,
        })),
      },
      reports: {
        total: totalReports,
        pending: pendingReports,
        approved: totalReports - pendingReports,
      },
      attendance: {
        today: todayAttendance,
      },
      topInterns: topInterns.map((i) => ({
        id: i.id,
        name: i.name,
        avatarUrl: i.avatarUrl,
        activityCount: i._count.activities,
      })),
    };
  }

  async getAllReports(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (status === 'pending') where.isApproved = false;
    if (status === 'approved') where.isApproved = true;

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
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

  async getInternDetail(internId: string) {
    const intern = await this.prisma.user.findUnique({
      where: { id: internId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatarUrl: true,
        supervisor: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    if (!intern) return null;

    const [activities, attendances, reports, skills, badges] =
      await Promise.all([
        this.prisma.activity.count({ where: { userId: internId } }),
        this.prisma.attendance.count({ where: { userId: internId } }),
        this.prisma.report.count({ where: { userId: internId } }),
        this.prisma.userSkill.findMany({
          where: { userId: internId },
          include: { skill: true },
          orderBy: { level: 'desc' },
          take: 5,
        }),
        this.prisma.userBadge.findMany({
          where: { userId: internId },
          include: { badge: true },
        }),
      ]);

    const recentActivities = await this.prisma.activity.findMany({
      where: { userId: internId },
      orderBy: { date: 'desc' },
      take: 10,
    });

    return {
      ...intern,
      stats: {
        activities,
        attendances,
        reports,
      },
      topSkills: skills.map((s) => ({
        name: s.skill.name,
        level: s.level,
        hours: s.hours,
      })),
      badges: badges.map((b) => ({
        name: b.badge.name,
        icon: b.badge.icon,
        earnedAt: b.earnedAt,
      })),
      recentActivities,
    };
  }

  async updateUserRole(
    userId: string,
    role: 'INTERN' | 'SUPERVISOR' | 'ADMIN',
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async assignSupervisor(internId: string, supervisorId: string) {
    return this.prisma.user.update({
      where: { id: internId },
      data: { supervisorId },
      select: {
        id: true,
        name: true,
        supervisor: { select: { id: true, name: true } },
      },
    });
  }
}

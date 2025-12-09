import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupervisorService {
  constructor(private prisma: PrismaService) {}

  async getStats(supervisorId: string) {
    const [totalInterns, totalActivities, totalAttendances, pendingReports] = await Promise.all([
      this.prisma.user.count({
        where: { supervisorId, role: 'INTERN' },
      }),
      this.prisma.activity.count({
        where: { user: { supervisorId } },
      }),
      this.prisma.attendance.count({
        where: { user: { supervisorId } },
      }),
      this.prisma.report.count({
        where: { user: { supervisorId }, isApproved: false },
      }),
    ]);

    return {
      totalInterns,
      totalActivities,
      totalAttendances,
      pendingReports,
    };
  }

  async getMyInterns(supervisorId: string) {
    return this.prisma.user.findMany({
      where: {
        supervisorId,
        role: 'INTERN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            activities: true,
            attendances: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getInternDetail(supervisorId: string, internId: string) {
    const intern = await this.prisma.user.findFirst({
      where: {
        id: internId,
        supervisorId,
        role: 'INTERN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!intern) {
      throw new NotFoundException('Intern tidak ditemukan atau bukan bimbingan Anda');
    }

    const [stats, topSkills, recentActivities, recentAttendances] = await Promise.all([
      this.prisma.$transaction([
        this.prisma.activity.count({ where: { userId: internId } }),
        this.prisma.attendance.count({ where: { userId: internId } }),
        this.prisma.report.count({ where: { userId: internId } }),
      ]),
      this.prisma.userSkill.findMany({
        where: { userId: internId },
        include: { skill: true },
        orderBy: { hours: 'desc' },
        take: 5,
      }),
      this.prisma.activity.findMany({
        where: { userId: internId },
        orderBy: { date: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          category: true,
          duration: true,
          date: true,
        },
      }),
      this.prisma.attendance.findMany({
        where: { userId: internId },
        orderBy: { date: 'desc' },
        take: 7,
        select: {
          id: true,
          date: true,
          checkIn: true,
          checkOut: true,
          status: true,
        },
      }),
    ]);

    return {
      ...intern,
      stats: {
        activities: stats[0],
        attendances: stats[1],
        reports: stats[2],
      },
      topSkills: topSkills.map((sp) => ({
        name: sp.skill.name,
        level: sp.level,
        hours: sp.hours,
      })),
      recentActivities,
      recentAttendances,
    };
  }

  async getRecentActivities(supervisorId: string) {
    return this.prisma.activity.findMany({
      where: {
        user: { supervisorId },
      },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        duration: true,
        date: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getReports(supervisorId: string, status?: string) {
    let isApprovedFilter: boolean | undefined;
    if (status === 'APPROVED') {
      isApprovedFilter = true;
    } else if (status === 'PENDING') {
      isApprovedFilter = false;
    }

    const reports = await this.prisma.report.findMany({
      where: {
        user: { supervisorId },
        ...(isApprovedFilter !== undefined ? { isApproved: isApprovedFilter } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        isApproved: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return reports.map((report) => ({
      ...report,
      status: report.isApproved ? 'APPROVED' : 'PENDING',
    }));
  }
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckInDto, CheckOutDto } from './dto/check-in.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(userId: string, dto: CheckInDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingAttendance?.checkIn) {
      throw new BadRequestException('Already checked in today');
    }

    const isInRadius = await this.validateLocation(dto.latitude, dto.longitude);

    const now = new Date();
    const lateThreshold = new Date(today);
    lateThreshold.setHours(9, 0, 0, 0);

    const status = now > lateThreshold ? 'LATE' : 'PRESENT';

    if (existingAttendance) {
      return this.prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkIn: now,
          checkInPhoto: dto.photo,
          checkInLat: dto.latitude,
          checkInLng: dto.longitude,
          checkInAddress: dto.address,
          isInRadius,
          status,
          notes: dto.notes,
        },
      });
    }

    return this.prisma.attendance.create({
      data: {
        userId,
        date: today,
        checkIn: now,
        checkInPhoto: dto.photo,
        checkInLat: dto.latitude,
        checkInLng: dto.longitude,
        checkInAddress: dto.address,
        isInRadius,
        status,
        notes: dto.notes,
      },
    });
  }

  async checkOut(userId: string, dto: CheckOutDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('Please check in first');
    }

    if (attendance.checkOut) {
      throw new BadRequestException('Already checked out today');
    }

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: new Date(),
        checkOutPhoto: dto.photo,
        checkOutLat: dto.latitude,
        checkOutLng: dto.longitude,
        checkOutAddress: dto.address,
        notes: dto.notes
          ? `${attendance.notes || ''}\n${dto.notes}`
          : attendance.notes,
      },
    });
  }

  async getTodayAttendance(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  async getAttendanceHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [attendances, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.attendance.count({ where: { userId } }),
    ]);

    return {
      data: attendances,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMonthlySummary(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const summary = {
      totalDays: attendances.length,
      present: attendances.filter((a) => a.status === 'PRESENT').length,
      late: attendances.filter((a) => a.status === 'LATE').length,
      absent: attendances.filter((a) => a.status === 'ABSENT').length,
      leave: attendances.filter((a) => a.status === 'LEAVE').length,
      totalWorkHours: 0,
    };

    attendances.forEach((a) => {
      if (a.checkIn && a.checkOut) {
        const hours =
          (a.checkOut.getTime() - a.checkIn.getTime()) / (1000 * 60 * 60);
        summary.totalWorkHours += hours;
      }
    });

    return {
      summary,
      attendances,
    };
  }

  async getAttendanceById(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return attendance;
  }

  async getOfficeLocations() {
    return this.prisma.officeLocation.findMany({
      where: { isActive: true },
    });
  }

  async validateLocation(lat: number, lng: number): Promise<boolean> {
    const offices = await this.getOfficeLocations();

    for (const office of offices) {
      const distance = this.calculateDistance(
        lat,
        lng,
        office.latitude,
        office.longitude,
      );

      if (distance <= office.radius) {
        return true;
      }
    }

    return false;
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

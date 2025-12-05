import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check in with photo and GPS location' })
  checkIn(@Request() req, @Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(req.user.id, dto);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Check out with photo and GPS location' })
  checkOut(@Request() req, @Body() dto: CheckOutDto) {
    return this.attendanceService.checkOut(req.user.id, dto);
  }

  @Get('today')
  @ApiOperation({ summary: "Get today's attendance" })
  getTodayAttendance(@Request() req) {
    return this.attendanceService.getTodayAttendance(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get attendance history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAttendanceHistory(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.attendanceService.getAttendanceHistory(
      req.user.id,
      page || 1,
      limit || 10,
    );
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get monthly attendance summary' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  getMonthlySummary(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.attendanceService.getMonthlySummary(req.user.id, year, month);
  }

  @Get('office-locations')
  @ApiOperation({ summary: 'Get office locations for geofencing' })
  getOfficeLocations() {
    return this.attendanceService.getOfficeLocations();
  }

  @Post('validate-location')
  @ApiOperation({ summary: 'Validate if location is within office radius' })
  validateLocation(@Body() body: { latitude: number; longitude: number }) {
    return this.attendanceService.validateLocation(body.latitude, body.longitude);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance detail with location' })
  getAttendanceById(@Param('id') id: string) {
    return this.attendanceService.getAttendanceById(id);
  }
}

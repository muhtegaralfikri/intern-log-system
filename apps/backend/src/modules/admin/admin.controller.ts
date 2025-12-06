import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERVISOR')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      role,
    );
  }

  @Get('interns')
  @ApiOperation({ summary: 'Get all interns' })
  getInterns(
    @Query('supervisorId') supervisorId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getInterns(
      supervisorId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('interns/:id')
  @ApiOperation({ summary: 'Get intern detail' })
  getInternDetail(@Param('id') id: string) {
    return this.adminService.getInternDetail(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get all reports' })
  getAllReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllReports(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
    );
  }

  @Patch('users/:id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user role' })
  updateUserRole(
    @Param('id') id: string,
    @Body('role') role: 'INTERN' | 'SUPERVISOR' | 'ADMIN',
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Patch('interns/:id/supervisor')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Assign supervisor to intern' })
  assignSupervisor(
    @Param('id') internId: string,
    @Body('supervisorId') supervisorId: string,
  ) {
    return this.adminService.assignSupervisor(internId, supervisorId);
  }
}

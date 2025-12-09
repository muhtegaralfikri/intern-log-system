import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { SupervisorService } from './supervisor.service';

@ApiTags('Supervisor')
@Controller('supervisor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPERVISOR', 'ADMIN')
@ApiBearerAuth()
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get supervisor dashboard stats' })
  getStats(@Request() req: { user: { id: string } }) {
    return this.supervisorService.getStats(req.user.id);
  }

  @Get('interns')
  @ApiOperation({ summary: 'Get interns supervised by current user' })
  getMyInterns(@Request() req: { user: { id: string } }) {
    return this.supervisorService.getMyInterns(req.user.id);
  }

  @Get('interns/:id')
  @ApiOperation({ summary: 'Get intern detail' })
  getInternDetail(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.supervisorService.getInternDetail(req.user.id, id);
  }

  @Get('activities/recent')
  @ApiOperation({ summary: 'Get recent activities from supervised interns' })
  getRecentActivities(@Request() req: { user: { id: string } }) {
    return this.supervisorService.getRecentActivities(req.user.id);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get reports from supervised interns' })
  getReports(
    @Request() req: { user: { id: string } },
    @Query('status') status?: string,
  ) {
    return this.supervisorService.getReports(req.user.id, status);
  }
}

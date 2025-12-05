import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reportsService.findAll(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by id' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.reportsService.findOne(id, req.user.id);
  }
}

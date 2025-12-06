import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get all users (Admin/Supervisor only)' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('my-interns')
  @UseGuards(RolesGuard)
  @Roles('SUPERVISOR')
  @ApiOperation({ summary: 'Get interns assigned to supervisor' })
  getMyInterns(@Request() req) {
    return this.usersService.getInterns(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Patch(':internId/assign-supervisor/:supervisorId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Assign supervisor to intern (Admin only)' })
  assignSupervisor(
    @Param('internId') internId: string,
    @Param('supervisorId') supervisorId: string,
  ) {
    return this.usersService.assignSupervisor(internId, supervisorId);
  }
}

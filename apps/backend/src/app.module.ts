import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AttendanceModule,
    ActivitiesModule,
    ReportsModule,
    AiModule,
  ],
})
export class AppModule {}

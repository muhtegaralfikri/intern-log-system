import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';
import { SkillsModule } from './modules/skills/skills.module';
import { BadgesModule } from './modules/badges/badges.module';
import { MoodModule } from './modules/mood/mood.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AttendanceModule,
    ActivitiesModule,
    ReportsModule,
    AiModule,
    SkillsModule,
    BadgesModule,
    MoodModule,
    FeedbackModule,
    AdminModule,
  ],
})
export class AppModule {}

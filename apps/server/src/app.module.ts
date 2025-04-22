import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { MeetingModule } from './meeting/meeting.module';
import { SubmissionModule } from './submission/submission.module';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MeetingModule,
    SubmissionModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

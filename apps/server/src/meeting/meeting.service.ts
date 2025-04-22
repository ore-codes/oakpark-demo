import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessToken } from 'livekit-server-sdk';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeetingService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getMeetingByCode(code: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { code },
      include: {
        participants: { include: { user: { select: { username: true } } } },
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return { meeting };
  }

  async createMeeting(
    userId: string,
    data: { title: string; description?: string },
  ) {
    const meetingCode = await this.generateUniqueCode();

    return this.prisma.meeting.create({
      data: {
        ...data,
        userId,
        code: meetingCode,
        durationInSecs: 0,
      },
    });
  }

  async joinMeeting(userId: string, code: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { code },
      include: { participants: true },
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!meeting) throw new NotFoundException('Meeting not found');

    const liveKitToken = new AccessToken(
      this.config.get<string>('liveKit.apiKey'),
      this.config.get<string>('liveKit.secret'),
      { identity: userId, name: user.username },
    );
    liveKitToken.addGrant({
      room: meeting.id,
      roomJoin: true,
      roomCreate: true,
    });
    const token = await liveKitToken.toJwt();

    const participant = await this.prisma.meetingParticipant.upsert({
      where: { userId_meetingId: { userId, meetingId: meeting.id } },
      update: {
        joinTime: new Date(),
        isActive: true,
      },
      create: {
        userId,
        meetingId: meeting.id,
        joinTime: new Date(),
        durationInSecs: 0,
        isActive: true,
      },
    });

    if (meeting.startTime === null && meeting.participants.length === 0) {
      await this.prisma.meeting.update({
        where: { id: meeting.id },
        data: { startTime: new Date() },
      });
    }

    const meetingWithParticipants = await this.prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: {
        participants: { include: { user: { select: { username: true } } } },
      },
    });

    return { participant, token, meeting: meetingWithParticipants };
  }

  async leaveMeeting(userId: string, code: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { code },
      include: { participants: true },
    });

    if (!meeting) throw new NotFoundException('Meeting not found');

    const participant = await this.prisma.meetingParticipant.findUnique({
      where: { userId_meetingId: { userId, meetingId: meeting.id } },
    });

    if (!participant) throw new NotFoundException('Participant not found');

    const currentTime = new Date();
    const durationInSecs =
      (currentTime.getTime() - participant.joinTime.getTime()) / 1000;

    await this.prisma.meetingParticipant.update({
      where: { id: participant.id },
      data: {
        durationInSecs: Math.floor(durationInSecs),
        isActive: false,
      },
    });

    const activeParticipants = await this.prisma.meetingParticipant.findMany({
      where: { meetingId: meeting.id, isActive: true },
    });

    if (activeParticipants.length === 0 && meeting.startTime) {
      const meetingDuration =
        (currentTime.getTime() - meeting.startTime.getTime()) / 1000;

      await this.prisma.meeting.update({
        where: { id: meeting.id },
        data: { durationInSecs: Math.floor(meetingDuration) },
      });
    }
  }

  async getCreatedMeetings(userId: string) {
    return this.prisma.meeting.findMany({
      where: { userId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async generateUniqueCode(): Promise<string> {
    let uniqueCode: string;
    let collision = true;

    while (collision) {
      uniqueCode = randomBytes(6).toString('hex').slice(0, 9);
      const existingMeeting = await this.prisma.meeting.findUnique({
        where: { code: uniqueCode },
      });

      if (!existingMeeting) collision = false;
    }

    return uniqueCode;
  }
}

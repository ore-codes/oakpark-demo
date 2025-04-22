import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { JoinMeetingDto } from './dto/join-meeting.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Meetings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get('created')
  @ApiResponse({ status: 200, description: 'Meetings retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getCreatedMeetings(@Req() req: any) {
    const userId = req.user.userId;
    return this.meetingService.getCreatedMeetings(userId);
  }

  @Get(':code')
  @ApiResponse({ status: 200, description: 'Meeting retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Meeting not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMeetingById(@Param('code') code: string) {
    return this.meetingService.getMeetingByCode(code);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Meeting successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createMeeting(@Req() req: any, @Body() body: CreateMeetingDto) {
    const userId = req.user.userId;
    return this.meetingService.createMeeting(userId, body);
  }

  @Put('join')
  @ApiResponse({ status: 200, description: 'Successfully joined the meeting.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Meeting not found.' })
  joinMeeting(@Req() req: any, @Body() { code }: JoinMeetingDto) {
    const userId = req.user.userId;
    return this.meetingService.joinMeeting(userId, code);
  }

  @Put('leave')
  @ApiResponse({ status: 200, description: 'Successfully left the meeting.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'Meeting or participant not found.',
  })
  leaveMeeting(@Req() req: any, @Body() { code }: JoinMeetingDto) {
    const userId = req.user.userId;
    return this.meetingService.leaveMeeting(userId, code);
  }
}

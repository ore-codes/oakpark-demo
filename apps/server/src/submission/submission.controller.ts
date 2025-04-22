import {
  Controller,
  Post,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmissionService } from './submission.service';
import { User } from '../auth/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FileUploadDto, SubmissionDto } from './dto/submission.dto';

@ApiTags('submissions')
@ApiBearerAuth()
@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post(':meetingId')
  @ApiOperation({
    summary: 'Create a new submission',
    description: 'Upload a file (PDF, JPG, or DOCX) for a specific meeting.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'meetingId',
    description: 'ID of the meeting to submit the file to',
    type: String,
  })
  @ApiBody({
    description: 'File to upload (max 10MB)',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: SubmissionDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  @ApiBadRequestResponse({
    description: 'Invalid file type, file too large, or no file provided',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'application/pdf' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only PDF, JPG, and DOCX files are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  async createSubmission(
    @User('id') userId: string,
    @Param('meetingId') meetingId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.submissionService.createSubmission(userId, meetingId, file);
  }

  @Get('meeting/:meetingId')
  @ApiOperation({
    summary: 'Get all submissions for a meeting',
    description: 'Retrieve all submissions for a specific meeting with user information.',
  })
  @ApiParam({
    name: 'meetingId',
    description: 'ID of the meeting to get submissions for',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of submissions for the meeting',
    type: [SubmissionDto],
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  async getSubmissionsByMeeting(@Param('meetingId') meetingId: string) {
    return this.submissionService.getSubmissionsByMeeting(meetingId);
  }

  @Get('user')
  @ApiOperation({
    summary: "Get user's submissions",
    description: "Retrieve all submissions made by the authenticated user across all meetings.",
  })
  @ApiResponse({
    status: 200,
    description: 'List of user submissions',
    type: [SubmissionDto],
  })
  @ApiUnauthorizedResponse({
    description: 'User is not authenticated',
  })
  async getMySubmissions(@User('id') userId: string) {
    return this.submissionService.getSubmissionsByUser(userId);
  }
} 
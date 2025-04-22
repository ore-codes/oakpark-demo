import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  email: string;
}

export class MeetingDto {
  @ApiProperty({
    description: 'Meeting ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Meeting title',
    example: 'Final Exam',
  })
  title: string;

  @ApiProperty({
    description: 'Meeting code',
    example: 'ABC123',
  })
  code: string;

  @ApiProperty({
    description: 'Meeting description',
    example: 'Final examination for Computer Science 101',
    required: false,
  })
  description?: string;
}

export class SubmissionDto {
  @ApiProperty({
    description: 'Submission ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Meeting ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  meetingId: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'URL of the uploaded file',
    example: 'https://res.cloudinary.com/example/file.pdf',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Original name of the uploaded file',
    example: 'assignment.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  fileType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1024000,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Submission creation timestamp',
    example: '2024-04-22T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Submission last update timestamp',
    example: '2024-04-22T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User who made the submission',
    type: UserDto,
  })
  user?: UserDto;

  @ApiProperty({
    description: 'Meeting the submission belongs to',
    type: MeetingDto,
  })
  meeting?: MeetingDto;
}

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (PDF, JPG, or DOCX, max 10MB)',
  })
  file: any;
} 
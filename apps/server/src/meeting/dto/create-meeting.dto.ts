import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({ description: 'Title of the meeting', example: 'Team Sync' })
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Optional description of the meeting',
    example: 'Daily stand-up meeting for the engineering team',
    required: false,
  })
  @IsOptional()
  description?: string;
}

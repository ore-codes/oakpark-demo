import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class JoinMeetingDto {
  @ApiProperty({
    description: 'Unique meeting code',
    example: 'abcxyz123',
  })
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(9)
  code: string;
}

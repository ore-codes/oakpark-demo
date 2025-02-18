import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'Password123' })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and be at least six characters long',
  })
  password: string;
}

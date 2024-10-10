import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterUserRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @ValidateIf((o) => o.password === o.confirmPassword)
  @MinLength(8, {
    message: 'Password confirmation must be at least 6 characters long',
  })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Matches(/^010\d{8}$/, {
    message:
      'Phone number must be in the format 010XXXXXXXX and be exactly 11 digits long',
  })
  phoneNumber: string;

  @IsEnum(['A', 'B', 'C', 'D'], {
    message: 'Group must be one of A, B, C, or D',
  })
  group: 'A' | 'B' | 'C' | 'D';
}

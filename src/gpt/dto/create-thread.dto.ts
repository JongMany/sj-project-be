import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateThreadDto {
  @IsEnum(['Funny', 'Feedback', 'Kind', 'Default'])
  type: 'Funny' | 'Feedback' | 'Kind' | 'Default';

  @IsString()
  @IsEmail()
  email: string;
}

import { IsEmail, IsEnum, IsString } from 'class-validator';
export type AssistantType = 'Funny' | 'Feedback' | 'Kind' | 'Default';
export class CreateThreadDto {
  @IsEnum(['Funny', 'Feedback', 'Kind', 'Default'])
  type: AssistantType;

  @IsString()
  @IsEmail()
  email: string;
}

import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateChatEventLogDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['Funny', 'Feedback', 'Kind', 'Default'])
  agentType: 'Funny' | 'Feedback' | 'Kind' | 'Default';

  @IsEnum(['Chat'])
  @IsNotEmpty()
  eventType: 'Chat';
}

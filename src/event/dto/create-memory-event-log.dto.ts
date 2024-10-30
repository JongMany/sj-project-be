import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateMemoryEventLogDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['Watch', 'Delete', 'Edit'])
  @IsNotEmpty()
  eventType: 'Watch' | 'Delete' | 'Edit';

  @IsEnum(['Funny', 'Feedback', 'Kind', 'Default'])
  @IsNotEmpty()
  agentType: 'Funny' | 'Feedback' | 'Kind' | 'Default';
}

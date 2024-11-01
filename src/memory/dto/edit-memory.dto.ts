import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AssistantType } from 'src/gpt/dto/create-thread.dto';

export class EditMemoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty, null, or undefined.' })
  description: string;

  @IsEnum(['Funny', 'Feedback', 'Kind', 'Default'])
  type: AssistantType;
}

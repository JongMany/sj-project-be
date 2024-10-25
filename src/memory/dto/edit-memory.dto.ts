import { IsNotEmpty, IsString } from 'class-validator';

export class EditMemoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty, null, or undefined.' })
  description: string;
}

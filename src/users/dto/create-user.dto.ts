import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsInt()
  efficiency: number;
}

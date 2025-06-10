import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsInt()
  @IsOptional()
  efficiency?: number;
}

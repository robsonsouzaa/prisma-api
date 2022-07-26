import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEmail()
  authorEmail: string;
}

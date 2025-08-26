import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateConductorDto {
  @IsString()
  rut!: string;

  @IsString()
  @Length(6, 6)
  pin!: string;

  @IsOptional() @IsString()
  nombre?: string;

  @IsOptional() @IsString()
  apellido?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  fono?: string;
}

import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @IsString() @IsNotEmpty()
  rut!: string;

  @IsString() @Length(6, 6)
  pin!: string;

  @IsString() @IsNotEmpty()
  nombre!: string;

  @IsString() @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsOptional() @IsString()
  fono?: string;
}

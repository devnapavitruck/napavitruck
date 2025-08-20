import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length, Min } from 'class-validator';

export class CreateEmpresaDto {
  @IsString() @IsNotEmpty()
  rut!: string;

  @IsString() @IsNotEmpty()
  razonSocial!: string;

  @IsOptional() @IsString()
  contactoNombre?: string;

  @IsOptional() @IsEmail()
  contactoEmail?: string;

  @IsOptional() @IsString()
  contactoFono?: string;

  @IsInt() @IsPositive()
  cuposMax!: number;

  @IsDateString()
  suscripcionInicio!: string;

  @IsInt() @Min(1)
  suscripcionDias!: number;

  // Admin inicial:
  @IsString() @IsNotEmpty()
  adminRut!: string;

  @IsString() @Length(6, 6)
  adminPin!: string;

  @IsString() @IsNotEmpty()
  adminNombre!: string;

  @IsString() @IsNotEmpty()
  adminApellido!: string;

  @IsEmail()
  adminEmail!: string;

  @IsOptional() @IsString()
  adminFono?: string;
}

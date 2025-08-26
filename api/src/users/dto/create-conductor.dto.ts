import { IsEmail, IsMongoId, IsOptional, IsString, Matches, IsEnum } from 'class-validator';

export class CreateConductorDto {
  @IsEnum(['DEPENDIENTE', 'INDEPENDIENTE'] as const)
  tipo!: 'DEPENDIENTE' | 'INDEPENDIENTE';

  // Si DEPENDIENTE
  @IsOptional() @IsMongoId()
  empresaId?: string;

  // Opcional: admin asignado (de la misma empresa)
  @IsOptional() @IsMongoId()
  adminAsignadoId?: string;

  @IsString() rut!: string;
  @IsString() nombres!: string;
  @IsString() apellidos!: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  fono?: string;

  @IsOptional() @IsString()
  fechaNacimiento?: string; // ISO

  @Matches(/^\d{6}$/, { message: 'PIN debe tener 6 dígitos' })
  @Matches(/^(?!000000)(?!123456)\d{6}$/, { message: 'PIN no puede ser trivial' })
  pin!: string;
}

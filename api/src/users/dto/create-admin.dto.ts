import { IsEmail, IsMongoId, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAdminDto {
  @IsMongoId()
  empresaId!: string;

  @IsString() rut!: string;
  @IsString() nombre!: string;
  @IsString() apellido!: string;

  @IsEmail()
  email!: string;

  @IsOptional() @IsString()
  fono?: string;

  // PIN manual (6 dígitos, no "000000" ni "123456")
  @Matches(/^\d{6}$/, { message: 'PIN debe tener 6 dígitos' })
  @Matches(/^(?!000000)(?!123456)\d{6}$/, { message: 'PIN no puede ser trivial (000000/123456)' })
  pin!: string;
}

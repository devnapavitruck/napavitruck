import { IsString, Length, Matches } from 'class-validator';

export class ValidarCodigoDto {
  @IsString()
  @Length(6, 12)
  @Matches(/^[A-Z2-9]+$/, { message: 'Código inválido' }) // sin O/I/0/1
  codigo!: string;
}

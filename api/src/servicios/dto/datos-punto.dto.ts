import { IsInt, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class DatosPuntoDto {
  @IsInt() @Min(0)
  puntoIndex!: number;

  @IsOptional() @IsString() @MaxLength(30)
  numeroGuia?: string;

  @IsOptional() @IsString() @MaxLength(30)
  numeroSello?: string;

  @IsOptional() @IsString() @MaxLength(40)
  incidenteId?: string;

  @IsOptional() @IsString() @MaxLength(120)
  incidenteNotas?: string;

  @IsOptional() @IsString() @MaxLength(150)
  observaciones?: string;
}

import { IsIn, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class MarcarDto {
  @IsInt() @Min(0)
  puntoIndex!: number;

  @IsIn(['presentacion','inicio','termino'])
  tipoMarca!: 'presentacion'|'inicio'|'termino';

  @IsOptional() @IsNumber()
  lat?: number;

  @IsOptional() @IsNumber()
  lng?: number;
}

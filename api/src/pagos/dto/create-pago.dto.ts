import { IsDateString, IsEnum, IsInt, IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePagoDto {
  @IsMongoId()
  empresaId!: string;

  @IsDateString()
  fechaPago!: string;

  @IsString()
  numeroFactura!: string;

  @IsInt()
  @IsEnum([30, 90, 180, 360] as const)
  planDias!: 30 | 90 | 180 | 360;

  @IsNumber() @Min(0)
  planValorLista!: number;

  @IsNumber() @Min(0)
  montoPagado!: number;

  @IsString()
  @IsEnum(['Transferencia', 'Tarjeta', 'Efectivo', 'Otro'] as const)
  metodo!: 'Transferencia' | 'Tarjeta' | 'Efectivo' | 'Otro';

  @IsOptional() @IsString()
  notas?: string;
}

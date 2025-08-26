import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PuntoDto {
  @IsEnum(['CARGA','INTERMEDIO','DESCARGA'] as const)
  tipo!: 'CARGA'|'INTERMEDIO'|'DESCARGA';

  @IsString()
  @MaxLength(120)
  lugar!: string;
}

export class ConfigurarOperacionDto {
  @IsArray() @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => PuntoDto)
  puntos!: PuntoDto[];
}

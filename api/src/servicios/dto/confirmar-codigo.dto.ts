import {
  IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested,
  IsBoolean, IsEnum, IsNumber, IsOptional, IsString,
  Matches, MaxLength, Min, ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidarCodigoDto } from './validar-codigo.dto';

export class ContenedorItemDto {
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Z]{3,4}[0-9]{6,7}$/, { message: 'Formato de contenedor inválido' })
  numeroContenedor!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  numeroRotainer?: string;
}

export class ConfirmarCodigoDto extends ValidarCodigoDto {
  @IsOptional() @IsEnum(['ONE_WAY', 'ROUND_TRIP'] as const) tipoServicio?: 'ONE_WAY'|'ROUND_TRIP';

  // equipo
  @IsOptional() @IsString() tractoPatente?: string;
  @IsOptional() @IsString() semiPatente?: string;
  @IsOptional() @IsString() semiTipoId?: string;

  // carga
  @IsOptional() @IsString() cargaTipoId?: string;

  // opcional: si viene, validamos; si no, backend la deriva de la carga
  @IsOptional() @IsEnum(['UNIDAD','LITROS','TONELADAS'] as const) cargaUnidad?: 'UNIDAD'|'LITROS'|'TONELADAS';

  @ValidateIf(o => o.cargaUnidad && o.cargaUnidad !== 'UNIDAD')
  @IsOptional() @IsNumber() @Min(0.01)
  cantidad?: number;

  // simple
  @IsOptional() @IsString() @MaxLength(20)
  @Matches(/^[A-Z]{3,4}[0-9]{6,7}$/, { message: 'Formato de contenedor inválido' })
  numeroContenedor?: string;

  @IsOptional() @IsString() @MaxLength(20)
  numeroRotainer?: string;

  // múltiple
  @IsOptional() @IsArray() @ArrayMinSize(2) @ArrayMaxSize(2)
  @ValidateNested({ each: true }) @Type(() => ContenedorItemDto)
  contenedores?: ContenedorItemDto[];

  @IsOptional() @IsBoolean() peligrosa?: boolean;
  @ValidateIf(o => o.peligrosa === true) @IsOptional() @IsString() @MaxLength(12) clasePeligrosa?: string;
  @ValidateIf(o => o.peligrosa === true) @IsOptional() @IsString() @MaxLength(12) nUN?: string;
}

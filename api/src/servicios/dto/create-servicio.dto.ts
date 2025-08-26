import {
  IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested,
  IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional,
  IsString, Matches, MaxLength, Min, ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateServicioDto {
  @IsOptional() @IsString() empresaId?: string;
  @IsOptional() @IsString() adminId?: string;
  @IsOptional() @IsString() conductorId?: string;

  @IsEnum(['ONE_WAY', 'ROUND_TRIP'] as const)
  tipoServicio!: 'ONE_WAY' | 'ROUND_TRIP';

  // equipo
  @IsOptional() @IsString() tractoPatente?: string;
  @IsOptional() @IsString() semiPatente?: string;
  @IsString() semiTipoId!: string;

  // carga
  @IsString() cargaTipoId!: string;

  // Si envías cargaUnidad, se valida; si la omites, backend la deriva del catálogo
  @IsOptional()
  @IsEnum(['UNIDAD', 'LITROS', 'TONELADAS'] as const)
  cargaUnidad?: 'UNIDAD' | 'LITROS' | 'TONELADAS';

  @ValidateIf(o => o.cargaUnidad && o.cargaUnidad !== 'UNIDAD')
  @IsOptional() @IsNumber() @Min(0.01)
  cantidad?: number;

  // Caso simple (1 contenedor)
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Z]{3,4}[0-9]{6,7}$/, { message: 'Formato de contenedor inválido' })
  numeroContenedor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  numeroRotainer?: string;

  // Caso múltiple (2 contenedores)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => ContenedorItemDto)
  contenedores?: ContenedorItemDto[];

  @IsOptional() @IsBoolean() peligrosa?: boolean;
  @ValidateIf(o => o.peligrosa === true) @IsOptional() @IsString() @MaxLength(12) clasePeligrosa?: string;
  @ValidateIf(o => o.peligrosa === true) @IsOptional() @IsString() @MaxLength(12) nUN?: string;

  // opcionales
  @IsOptional() @IsString() codigo?: string;
  @IsOptional() @IsBoolean() requiereAprobacionAlReclamar?: boolean;

  @IsOptional() @IsDateString() fecha?: string;
}

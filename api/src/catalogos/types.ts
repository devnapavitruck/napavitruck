export type Unidad = 'UNIDAD' | 'LITROS' | 'TONELADAS';

export interface SemiItem {
  id: string;
  nombre: string;
}

export interface CargaItem {
  id: string;
  nombre: string;
  unidad: Unidad;
  reqContenedor?: boolean;
  reqRotainer?: boolean;
}

export interface RelacionItem {
  semiId: string;
  cargaId: string;
  /** Máximo de contenedores permitidos para esta combinación (default: 1) */
  maxContenedores?: number;
}

export interface CatalogoData {
  semirremolques: SemiItem[];
  cargas: CargaItem[];
  relaciones: RelacionItem[];
}

export interface Capabilities {
  unidad: Unidad;
  reqContenedor: boolean;
  reqRotainer: boolean;
  maxContenedores: number; // 1 o 2 (por ahora)
}

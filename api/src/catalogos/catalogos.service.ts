import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CatalogoData, CargaItem, RelacionItem, SemiItem, Capabilities, Unidad } from './types';

@Injectable()
export class CatalogosService {
  private data!: CatalogoData;

  private cargasById = new Map<string, CargaItem>();
  private semisById = new Map<string, SemiItem>();
  private cargasPorSemi = new Map<string, CargaItem[]>();
  private relacionMap = new Map<string, RelacionItem>(); // key = `${semiId}|${cargaId}`

  constructor() {
    const p = path.resolve(__dirname, 'catalogos.json');
    try {
      const raw = fs.readFileSync(p, 'utf8');
      this.data = JSON.parse(raw) as CatalogoData;

      this.data.cargas.forEach(c => this.cargasById.set(c.id, c));
      this.data.semirremolques.forEach(s => this.semisById.set(s.id, s));

      this.data.relaciones.forEach((rel: RelacionItem) => {
        const carga = this.cargasById.get(rel.cargaId);
        if (!carga) return;
        const arr = this.cargasPorSemi.get(rel.semiId) ?? [];
        arr.push(carga);
        this.cargasPorSemi.set(rel.semiId, arr);
        this.relacionMap.set(`${rel.semiId}|${rel.cargaId}`, rel);
      });
    } catch (e) {
      throw new InternalServerErrorException(`Error cargando catálogos: ${(e as Error).message}`);
    }
  }

  getSemirremolques() { return this.data.semirremolques; }
  getCargas() { return this.data.cargas; }
  getRelaciones() { return this.data.relaciones; }
  getMatriz() { return this.data; }

  validateSemiCarga(semiId: string, cargaId: string) {
    const opciones = this.cargasPorSemi.get(semiId) ?? [];
    return opciones.find(c => c.id === cargaId) ?? null;
  }

  getCarga(cargaId: string) { return this.cargasById.get(cargaId); }
  getSemi(semiId: string) { return this.semisById.get(semiId); }

  getRelacion(semiId: string, cargaId: string) {
    return this.relacionMap.get(`${semiId}|${cargaId}`);
  }

  /** Capacidades derivadas por combinación semi↔carga */
  getCapabilities(semiId: string, cargaId: string): Capabilities | null {
    const carga = this.getCarga(cargaId);
    if (!carga) return null;
    const rel = this.getRelacion(semiId, cargaId);
    return {
      unidad: carga.unidad,
      reqContenedor: !!carga.reqContenedor,
      reqRotainer: !!carga.reqRotainer,
      maxContenedores: rel?.maxContenedores ?? 1,
    };
  }

  validateUnidad(cargaId: string, unidad: Unidad) {
    const carga = this.getCarga(cargaId);
    return !!carga && carga.unidad === unidad;
  }
}

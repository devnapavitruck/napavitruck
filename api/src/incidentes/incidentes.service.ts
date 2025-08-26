import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface IncidenteItem {
  id: string;
  nombre: string;
  severidad?: 'BAJA'|'MEDIA'|'ALTA';
}

@Injectable()
export class IncidentesService {
  private list: IncidenteItem[] = [];

  constructor() {
    const p = path.resolve(__dirname, 'catalogo-incidentes.json');
    try {
      const raw = fs.readFileSync(p, 'utf8');
      this.list = JSON.parse(raw) as IncidenteItem[];
    } catch (e) {
      throw new InternalServerErrorException(`Error cargando incidentes: ${(e as Error).message}`);
    }
  }

  all() { return this.list; }
  find(id: string) { return this.list.find(i => i.id === id) || null; }
}

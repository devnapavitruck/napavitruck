import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServicioDocument = Servicio & Document;

type Unidad = 'UNIDAD'|'LITROS'|'TONELADAS';
type PuntoTipo = 'CARGA'|'INTERMEDIO'|'DESCARGA';

@Schema({ timestamps: true })
export class Servicio {
  @Prop({ type: Types.ObjectId, ref: 'Empresa', index: true })
  empresaId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', index: true })
  adminId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', index: true })
  conductorId?: Types.ObjectId;

  @Prop({ required: true, enum: ['ONE_WAY', 'ROUND_TRIP'] })
  tipoServicio!: 'ONE_WAY' | 'ROUND_TRIP';

  @Prop({ type: Object })
  equipo?: {
    tractoPatente?: string;
    semiPatente?: string;
    semiTipoId?: string; // ID de catálogo
  };

  @Prop({
    type: {
      tipoId: { type: String, required: true },
      unidad: { type: String, required: true }, // UNIDAD | LITROS | TONELADAS
      cantidad: { type: Number },
      numeroContenedor: { type: String },
      numeroRotainer: { type: String },
      contenedores: [{
        numeroContenedor: { type: String, required: true },
        numeroRotainer: { type: String }
      }],
      peligrosa: { type: Boolean },
      clasePeligrosa: { type: String },
      nUN: { type: String }
    },
    required: true,
    _id: false
  })
  carga!: {
    tipoId: string;
    unidad: Unidad;
    cantidad?: number;
    numeroContenedor?: string;
    numeroRotainer?: string;
    contenedores?: { numeroContenedor: string; numeroRotainer?: string }[];
    peligrosa?: boolean;
    clasePeligrosa?: string;
    nUN?: string;
  };

  @Prop({ type: String, index: true, unique: true, sparse: true })
  codigo?: string;

  @Prop({ type: Boolean, default: true })
  requiereAprobacionAlReclamar!: boolean;

  @Prop({
    type: {
      usado: { type: Boolean, default: false },
      usadoPor: { type: Types.ObjectId, ref: 'Usuario' },
      usadoEn: { type: Date },
    },
    _id: false,
  })
  reclamo?: { usado: boolean; usadoPor?: Types.ObjectId; usadoEn?: Date };

  @Prop({ type: String, default: 'ASIGNADO' })
  estadoOperativo!: string;

  @Prop({ type: Date, index: true, default: () => new Date() })
  fecha!: Date;

  // --------- NUEVO: Operación (puntos con marcas y evidencias) ----------
  @Prop({
    type: [{
      tipo: { type: String, enum: ['CARGA','INTERMEDIO','DESCARGA'], required: true },
      lugar: { type: String, required: true },
      marcas: {
        type: {
          presentacion: { type: Date },
          inicio: { type: Date },
          termino: { type: Date },
          geo: { type: { lat: Number, lng: Number }, _id: false }
        },
        _id: false
      },
      numeroGuia: { type: String },
      fotosGuia: { type: [String], default: [] },
      fotosCarga: { type: [String], default: [] },
      numeroSello: { type: String },
      incidenteId: { type: String },
      incidenteNotas: { type: String },
      observaciones: { type: String }
    }],
    _id: false,
    default: []
  })
  operacion?: Array<{
    tipo: PuntoTipo;
    lugar: string;
    marcas: {
      presentacion?: Date;
      inicio?: Date;
      termino?: Date;
      geo?: { lat: number; lng: number };
    };
    numeroGuia?: string;
    fotosGuia: string[];
    fotosCarga: string[];
    numeroSello?: string;
    incidenteId?: string;
    incidenteNotas?: string;
    observaciones?: string;
  }>;

  // Ruta (relativa) del PDF generado
  @Prop({ type: String })
  reportPdfPath?: string;
}

export const ServicioSchema = SchemaFactory.createForClass(Servicio);
ServicioSchema.index({ 'equipo.semiTipoId': 1 });
ServicioSchema.index({ 'carga.tipoId': 1 });

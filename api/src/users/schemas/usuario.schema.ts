import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Rol } from '../../common/enums/rol.enum';

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario extends Document {
  // Guardamos RUT normalizado (sin puntos ni guión)
  @Prop({ required: true, trim: true })
  rut!: string;

  @Prop({ required: true })
  pinHash!: string;

  @Prop({ trim: true })
  nombre?: string;

  @Prop({ trim: true })
  apellido?: string;

  @Prop({ lowercase: true, trim: true, index: true, sparse: true })
  email?: string;

  @Prop({ trim: true })
  fono?: string;

  @Prop({ required: true, enum: Object.values(Rol) })
  rol!: Rol;

  @Prop({ type: Types.ObjectId, ref: 'Empresa' })
  empresaId?: Types.ObjectId;

  @Prop({ default: true })
  primerLoginPendiente!: boolean;

  @Prop({
    type: {
      motivo: { type: String },
      fecha: { type: Date },
    },
    _id: false,
  })
  suspendido?: { motivo?: string; fecha?: Date };
}

export type UsuarioDocument = Usuario & Document;
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// ---- Índices (deja SOLO estos; no pongas unique también en @Prop) ----
UsuarioSchema.index({ rut: 1 }, { unique: true, name: 'idx_unique_rut' });
UsuarioSchema.index({ rol: 1, empresaId: 1 }, { name: 'idx_rol_empresa' });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Rol } from '../../common/enums/rol.enum';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true, unique: true }) // guardamos rut normalizado (sin puntos/guión)
  rut!: string;

  @Prop({ required: true })
  pinHash!: string;

  @Prop() nombre?: string;
  @Prop() apellido?: string;

  @Prop({ lowercase: true, trim: true, index: true, sparse: true, unique: false })
  email?: string;

  @Prop() fono?: string;

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

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
UsuarioSchema.index({ rut: 1 }, { unique: true });

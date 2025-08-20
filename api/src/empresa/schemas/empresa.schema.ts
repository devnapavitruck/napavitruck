import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class SuscripcionSub {
  @Prop({ required: true }) inicio!: Date;
  @Prop({ required: true }) fin!: Date;
  @Prop({ required: true, enum: ['activa', 'vencida'] }) estado!: 'activa' | 'vencida';
}

const SuscripcionSubSchema = SchemaFactory.createForClass(SuscripcionSub);

@Schema({ timestamps: true })
export class Empresa extends Document {
  @Prop({ required: true, unique: true }) rut!: string; // RUT empresa (normalizado)
  @Prop({ required: true }) razonSocial!: string;

  @Prop({
    type: {
      nombre: String,
      email: String,
      fono: String,
    },
    _id: false,
  })
  contacto?: { nombre?: string; email?: string; fono?: string };

  @Prop({ required: true, min: 1 }) cuposMax!: number;
  @Prop({ required: true, default: 0, min: 0 }) cuposOcupados!: number;

  @Prop({ type: SuscripcionSubSchema, required: true })
  suscripcion!: SuscripcionSub;

  @Prop({
    type: { motivo: String, fecha: Date },
    _id: false,
  })
  suspendida?: { motivo?: string; fecha?: Date };
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
EmpresaSchema.index({ rut: 1 }, { unique: true });

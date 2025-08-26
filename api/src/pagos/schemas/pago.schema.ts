import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PagoDocument = Pago & Document;

@Schema({ timestamps: true })
export class Pago {
  @Prop({ type: Types.ObjectId, ref: 'Empresa', index: true, required: true })
  empresaId!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  fechaPago!: Date;

  @Prop({ required: true, trim: true })
  numeroFactura!: string;

  @Prop({ required: true, enum: [30, 90, 180, 360] })
  planDias!: 30 | 90 | 180 | 360;

  @Prop({ required: true })
  planValorLista!: number;

  @Prop({ required: true })
  montoPagado!: number;

  @Prop({ required: true })
  metodo!: 'Transferencia' | 'Tarjeta' | 'Efectivo' | 'Otro';

  @Prop() notas?: string;
}

export const PagoSchema = SchemaFactory.createForClass(Pago);

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario } from './schemas/usuario.schema';
import * as bcrypt from 'bcrypt';
import { normalizeRut } from '../common/utils/rut.util';
import { Rol } from '../common/enums/rol.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Usuario', 'primary') // token del modelo + conexión
    private readonly userModel: Model<Usuario>,
  ) {}

  async findByRut(rut: string) {
    return this.userModel.findOne({ rut: normalizeRut(rut) }).exec();
  }

  async createAdminForEmpresa(input: {
    rut: string; pin: string; nombre: string; apellido: string; email: string; fono?: string; empresaId: Types.ObjectId;
  }) {
    const pinHash = await bcrypt.hash(input.pin, 10);
    const doc = new this.userModel({
      rut: normalizeRut(input.rut),
      pinHash,
      nombre: input.nombre,
      apellido: input.apellido,
      email: input.email,
      fono: input.fono,
      rol: Rol.ADMIN_EDT,
      empresaId: input.empresaId,
      primerLoginPendiente: true,
    });
    return doc.save();
  }

  async createSuperadminIfMissing(payload: {
    rut: string; pin: string; nombre: string; apellido: string; email: string; fono?: string;
  }) {
    const rutN = normalizeRut(payload.rut);
    const exists = await this.userModel.findOne({ rut: rutN }).exec();
    if (exists) return exists;
    const pinHash = await bcrypt.hash(payload.pin, 10);
    return this.userModel.create({
      rut: rutN,
      pinHash,
      nombre: payload.nombre,
      apellido: payload.apellido,
      email: payload.email,
      fono: payload.fono,
      rol: Rol.SUPERADMIN,
      primerLoginPendiente: false,
    });
  }

  async changePin(userId: string, newPin: string) {
    const pinHash = await bcrypt.hash(newPin, 10);
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(userId) },
      { $set: { pinHash, primerLoginPendiente: false } },
    ).exec();
    return { ok: true };
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Empresa } from '../empresa/schemas/empresa.schema';
import { Usuario } from '../users/schemas/usuario.schema';
import { CreateConductorDto } from './dto/create-conductor.dto';
import * as bcrypt from 'bcrypt';
import { normalizeRut } from '../common/utils/rut.util';
import { Rol } from '../common/enums/rol.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Empresa', 'primary') private readonly empModel: Model<Empresa>,
    @InjectModel('Usuario', 'primary') private readonly userModel: Model<Usuario>,
  ) {}

  private async getEmpresaIdDeAdmin(userId: string): Promise<Types.ObjectId> {
    const user = await this.userModel.findById(new Types.ObjectId(userId)).lean();
    if (!user || user.rol !== Rol.ADMIN_EDT || !user.empresaId) {
      throw new BadRequestException('Usuario no es ADMIN_EDT o no tiene empresa asociada');
    }
    return user.empresaId as unknown as Types.ObjectId;
  }

  async miEmpresa(userId: string) {
    const empresaId = await this.getEmpresaIdDeAdmin(userId);
    const emp = await this.empModel.findById(empresaId).lean();
    if (!emp) throw new NotFoundException('Empresa no encontrada');
    return emp;
  }

  async listarConductores(userId: string, p = 1, limit = 20) {
    const empresaId = await this.getEmpresaIdDeAdmin(userId);
    const page = Math.max(1, Number(p) || 1);
    const size = Math.max(1, Math.min(100, Number(limit) || 20));
    const [items, total] = await Promise.all([
      this.userModel.find({ rol: Rol.CONDUCTOR_DEP, empresaId }).sort({ createdAt: -1 })
        .skip((page - 1) * size).limit(size).lean().exec(),
      this.userModel.countDocuments({ rol: Rol.CONDUCTOR_DEP, empresaId }).exec(),
    ]);
    return { items, total, page, pageSize: size };
  }

  async crearConductor(userId: string, dto: CreateConductorDto) {
    const empresaId = await this.getEmpresaIdDeAdmin(userId);

    const emp = await this.empModel.findById(empresaId);
    if (!emp) throw new NotFoundException('Empresa no encontrada');
    if (emp.suspendida) throw new BadRequestException('Empresa suspendida');
    if (emp.suscripcion.fin < new Date()) throw new BadRequestException('Suscripción vencida');
    if (emp.cuposOcupados >= emp.cuposMax) throw new BadRequestException('No hay cupos disponibles');

    const rutN = normalizeRut(dto.rut);
    const existsUser = await this.userModel.findOne({ rut: rutN }).lean();
    if (existsUser) throw new BadRequestException('RUT de usuario ya registrado');

    const pinHash = await bcrypt.hash(dto.pin, 10);
    const user = await this.userModel.create({
      rut: rutN,
      pinHash,
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      fono: dto.fono,
      rol: Rol.CONDUCTOR_DEP,
      empresaId,
      primerLoginPendiente: true,
    });

    await this.empModel.updateOne({ _id: empresaId }, { $inc: { cuposOcupados: 1 } }).exec();
    return { conductor: user };
  }

  async suspenderConductor(userId: string, conductorId: string, motivo: string) {
    const empresaId = await this.getEmpresaIdDeAdmin(userId);
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(conductorId), empresaId, rol: Rol.CONDUCTOR_DEP },
      { $set: { suspendido: { motivo, fecha: new Date() } } },
    ).exec();
    return { ok: true };
  }

  async reactivarConductor(userId: string, conductorId: string) {
    const empresaId = await this.getEmpresaIdDeAdmin(userId);
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(conductorId), empresaId, rol: Rol.CONDUCTOR_DEP },
      { $unset: { suspendido: 1 } },
    ).exec();
    return { ok: true };
  }
}

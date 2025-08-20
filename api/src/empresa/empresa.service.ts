import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Empresa } from './schemas/empresa.schema';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UsersService } from '../users/users.service';
import { normalizeRut } from '../common/utils/rut.util';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectModel('Empresa', 'primary') // token + conexión
    private readonly empModel: Model<Empresa>,
    private readonly users: UsersService,
  ) {}

  async createWithAdmin(dto: CreateEmpresaDto) {
    const rutEmp = normalizeRut(dto.rut);
    const exists = await this.empModel.findOne({ rut: rutEmp }).exec();
    if (exists) throw new BadRequestException('Empresa ya existe');

    const inicio = new Date(dto.suscripcionInicio);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + dto.suscripcionDias);

    const empresa = await this.empModel.create({
      rut: rutEmp,
      razonSocial: dto.razonSocial,
      contacto: {
        nombre: dto.contactoNombre,
        email: dto.contactoEmail,
        fono: dto.contactoFono,
      },
      cuposMax: dto.cuposMax,
      cuposOcupados: 0,
      suscripcion: {
        inicio,
        fin,
        estado: fin > new Date() ? 'activa' : 'vencida',
      },
    });

    const admin = await this.users.createAdminForEmpresa({
      rut: dto.adminRut,
      pin: dto.adminPin,
      nombre: dto.adminNombre,
      apellido: dto.adminApellido,
      email: dto.adminEmail,
      fono: dto.adminFono,
      empresaId: empresa._id as Types.ObjectId,
    });

    return { empresa, admin };
  }

  async list(p = 1, limit = 20) {
    const page = Math.max(1, Number(p) || 1);
    const size = Math.max(1, Math.min(100, Number(limit) || 20));
    const [items, total] = await Promise.all([
      this.empModel.find().sort({ createdAt: -1 }).skip((page - 1) * size).limit(size).lean().exec(),
      this.empModel.countDocuments().exec(),
    ]);
    return { items, total, page, pageSize: size };
  }

  async suspend(id: string, motivo: string) {
    await this.empModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { suspendida: { motivo, fecha: new Date() } } },
    ).exec();
    return { ok: true };
  }

  async reactivate(id: string) {
    await this.empModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $unset: { suspendida: 1 } },
    ).exec();
    return { ok: true };
  }
}

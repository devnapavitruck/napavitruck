import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly users: UsersService) {}

  async onModuleInit() {
    const rut = process.env.SEED_SUPERADMIN_RUT;
    const pin = process.env.SEED_SUPERADMIN_PIN;
    if (!rut || !pin) return;

    await this.users.createSuperadminIfMissing({
      rut,
      pin,
      nombre: process.env.SEED_SUPERADMIN_NOMBRE || 'Super',
      apellido: process.env.SEED_SUPERADMIN_APELLIDO || 'Admin',
      email: process.env.SEED_SUPERADMIN_EMAIL || 'admin@example.com',
      fono: process.env.SEED_SUPERADMIN_FONO,
    });
  }
}

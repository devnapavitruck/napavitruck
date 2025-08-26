import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly users: UsersService) {}

  async onModuleInit() {
    try {
      await this.users.createSuperadminIfMissing({
        // RUT normalizado: sin puntos ni guión
        rut: '185069850',
        nombre: 'NASIF FARUK',
        apellido: 'NARA DELGADO',
        email: 'contacto@napavitruck.cl',
        fono: '+56968220532',
        pin: process.env.SA_PIN || '130109', // PIN manual inicial
      });
      this.logger.log('Seed OK: SUPERADMIN verificado/creado.');
    } catch (e) {
      this.logger.error(`Seed error: ${(e as Error).message}`);
    }
  }
}

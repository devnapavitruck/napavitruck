import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Empresa, EmpresaSchema } from '../empresa/schemas/empresa.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Empresa', schema: EmpresaSchema }], 'primary'),
    MongooseModule.forFeature([{ name: 'Usuario', schema: (require('../users/schemas/usuario.schema') as any).UsuarioSchema }], 'primary'),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

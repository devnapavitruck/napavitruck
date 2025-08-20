import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, EmpresaSchema } from './schemas/empresa.schema';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Empresa', schema: EmpresaSchema }], // usa string literal
      'primary',                                    // MISMA conexión
    ),
    UsersModule,
  ],
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}

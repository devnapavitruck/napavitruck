import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { Servicio, ServicioSchema } from './schemas/servicio.schema';
import { CatalogosModule } from '../catalogos/catalogos.module';
import { Usuario, UsuarioSchema } from '../users/schemas/usuario.schema';
import { IncidentesModule } from '../incidentes/incidentes.module';

@Module({
  imports: [
    CatalogosModule,
    IncidentesModule,
    MongooseModule.forFeature([
      { name: Servicio.name, schema: ServicioSchema },
      { name: Usuario.name, schema: UsuarioSchema },
    ]),
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {}

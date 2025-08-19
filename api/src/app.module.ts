import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth.controller';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosController } from './usuarios.controller';
import { EmpresaModule } from './empresa/empresa.module';
import { EmpresaController } from './empresa.controller';
import { SuscripcionModule } from './suscripcion/suscripcion.module';
import { SuscripcionController } from './suscripcion.controller';

@Module({
  imports: [
    // Carga variables desde .env y las expone en todo el proyecto
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    UsuariosModule,
    EmpresaModule,
    SuscripcionModule,
  ],
  controllers: [AppController, AuthController, UsuariosController, EmpresaController, SuscripcionController],
  providers: [AppService],
})
export class AppModule {}

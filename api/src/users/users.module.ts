import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Usuario', schema: UsuarioSchema }], // usa string literal
      'primary',                                     // MISMA conexión
    ),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

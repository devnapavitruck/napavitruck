import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { normalizeRut } from '../common/utils/rut.util';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async validate(rut: string, pin: string) {
    const user = await this.users.findByRut(normalizeRut(rut));
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(pin, user.pinHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  async login(rut: string, pin: string) {
    const user = await this.validate(rut, pin);
    const payload = { sub: user._id.toString(), rut: user.rut, rol: user.rol };
    const token = await this.jwt.signAsync(payload);
    return { access_token: token, rol: user.rol, primerLoginPendiente: user.primerLoginPendiente };
  }
}

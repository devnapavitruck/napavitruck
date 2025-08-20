import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString, Length } from 'class-validator';
import { JwtAuthGuard } from './jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

class LoginDto {
  @IsString() rut!: string;
  @IsString() @Length(6, 6) pin!: string;
}

class ChangePinDto {
  @IsString() @Length(6, 6) nuevoPin!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly users: UsersService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.rut, dto.pin);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('cambiar-pin')
  async changePin(@Req() req: any, @Body() dto: ChangePinDto) {
    await this.users.changePin(req.user.sub, dto.nuevoPin);
    return { ok: true };
  }
}

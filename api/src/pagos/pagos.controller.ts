import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';

@Controller('superadmin/pagos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.SUPERADMIN)
export class PagosController {
  constructor(private readonly svc: PagosService) {}

  @Post()
  registrar(@Body() dto: CreatePagoDto) {
    return this.svc.registrar(dto);
  }
}

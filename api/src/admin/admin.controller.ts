import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateConductorDto } from './dto/create-conductor.dto';

@ApiTags('ADMIN_EDT')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.ADMIN_EDT)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('mi-empresa')
  miEmpresa(@Req() req: any) {
    return this.service.miEmpresa(req.user.sub);
  }

  @Get('conductores')
  list(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.listarConductores(req.user.sub, Number(page), Number(limit));
  }

  @Post('conductores')
  crear(@Req() req: any, @Body() dto: CreateConductorDto) {
    return this.service.crearConductor(req.user.sub, dto);
  }

  @Patch('conductores/:id/suspender')
  suspender(@Req() req: any, @Param('id') id: string, @Body('motivo') motivo: string) {
    return this.service.suspenderConductor(req.user.sub, id, motivo);
  }

  @Patch('conductores/:id/reactivar')
  reactivar(@Req() req: any, @Param('id') id: string) {
    return this.service.reactivarConductor(req.user.sub, id);
  }
}

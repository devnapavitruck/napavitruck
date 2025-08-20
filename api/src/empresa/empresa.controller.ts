import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { SuspenderDto } from './dto/suspender.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Rol } from '../common/enums/rol.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('SUPERADMIN / empresas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.SUPERADMIN)
@Controller('superadmin/empresas')
export class EmpresaController {
  constructor(private readonly service: EmpresaService) {}

  @Post()
  create(@Body() dto: CreateEmpresaDto) {
    return this.service.createWithAdmin(dto);
  }

  @Get()
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.list(Number(page), Number(limit));
  }

  @Patch(':id/suspender')
  suspend(@Param('id') id: string, @Body() dto: SuspenderDto) {
    return this.service.suspend(id, dto.motivo);
  }

  @Patch(':id/reactivar')
  reactivate(@Param('id') id: string) {
    return this.service.reactivate(id);
  }
}

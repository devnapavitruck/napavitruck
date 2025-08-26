import type { Express } from 'express';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { ConfirmarCodigoDto } from './dto/confirmar-codigo.dto';
import { ValidarCodigoDto } from './dto/validar-codigo.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Rol } from '../common/enums/rol.enum';
import { ConfigurarOperacionDto } from './dto/configurar-operacion.dto';
import { MarcarDto } from './dto/marcar.dto';
import { DatosPuntoDto } from './dto/datos-punto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ServiciosController {
  constructor(private readonly svc: ServiciosService) {}

  /** ADMIN crea servicio */
  @Post('admin/servicios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN_EDT)
  create(@Body() dto: CreateServicioDto) {
    return this.svc.create(dto);
  }

  /** ADMIN genera código para un servicio existente */
  @Post('admin/servicios/:id/generar-codigo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN_EDT)
  generarCodigo(@Param('id') id: string, @Req() req: any) {
    const adminUserId = req.user?.sub as string;
    return this.svc.generarCodigo(id, adminUserId);
  }

  /** CONDUCTOR: validar código (prefill del wizard) */
  @Post('conductor/servicios/codigo/validar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  validarCodigo(@Body() dto: ValidarCodigoDto, @Req() req: any) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.validarCodigo(dto, conductorUserId);
  }

  /** CONDUCTOR: confirmar código (completa faltantes y reclama) */
  @Post('conductor/servicios/codigo/confirmar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  confirmarCodigo(@Body() dto: ConfirmarCodigoDto, @Req() req: any) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.confirmarCodigo(dto, conductorUserId);
  }

  // ---------- Operación ----------
  /** Configurar puntos (lugares) según tipo de servicio */
  @Patch('conductor/servicios/:id/operacion/configurar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  configurar(@Param('id') id: string, @Req() req: any, @Body() dto: ConfigurarOperacionDto) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.configurarOperacion(id, conductorUserId, dto);
  }

  /** Marcar presentación/inicio/término (botones bloqueados) */
  @Post('conductor/servicios/:id/operacion/marca')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  marcar(@Param('id') id: string, @Req() req: any, @Body() dto: MarcarDto) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.marcar(id, conductorUserId, dto);
  }

  /** Subir foto (guía/carga) */
  @Post('conductor/servicios/:id/operacion/foto')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  @UseInterceptors(FileInterceptor('file'))
  subirFoto(
    @Param('id') id: string,
    @Req() req: any,
    @Body('puntoIndex') puntoIndex: string,
    @Body('tipo') tipo: 'guia'|'carga',
    @UploadedFile() file: Express.Multer.File
  ) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.guardarFoto(id, conductorUserId, Number(puntoIndex), tipo, file);
  }

  /** Actualizar datos del punto (n° guía/sello, incidente, observaciones) */
  @Patch('conductor/servicios/:id/operacion/datos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  datos(@Param('id') id: string, @Req() req: any, @Body() dto: DatosPuntoDto) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.actualizarDatosPunto(id, conductorUserId, dto);
  }

  /** Finalizar y generar PDF */
  @Post('conductor/servicios/:id/finalizar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.CONDUCTOR_DEP, Rol.CONDUCTOR_IND)
  finalizar(@Param('id') id: string, @Req() req: any) {
    const conductorUserId = req.user?.sub as string;
    return this.svc.finalizarYGenerarPdf(id, conductorUserId);
  }

  /** SA: métricas agregadas */
  @Get('superadmin/metrics/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.SUPERADMIN)
  metrics(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('empresaId') empresaId?: string,
  ) {
    return this.svc.metrics(from, to, empresaId);
  }
}

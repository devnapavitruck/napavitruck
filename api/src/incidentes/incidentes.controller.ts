import { Controller, Get } from '@nestjs/common';
import { IncidentesService } from './incidentes.service';

@Controller('catalogos')
export class IncidentesController {
  constructor(private readonly svc: IncidentesService) {}

  @Get('incidentes')
  all() {
    return this.svc.all();
  }
}

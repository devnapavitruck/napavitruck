import { Controller, Get } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';

@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly svc: CatalogosService) {}

  @Get('semirremolques')
  semis() { return this.svc.getSemirremolques(); }

  @Get('cargas')
  cargas() { return this.svc.getCargas(); }

  @Get('relaciones')
  relaciones() { return this.svc.getRelaciones(); }

  @Get('matriz')
  matriz() { return this.svc.getMatriz(); }
}

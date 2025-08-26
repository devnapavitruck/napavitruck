import { Module } from '@nestjs/common';
import { CatalogosService } from './catalogos.service';
import { CatalogosController } from './catalogos.controller';

@Module({
  providers: [CatalogosService],
  controllers: [CatalogosController],
  exports: [CatalogosService],
})
export class CatalogosModule {}

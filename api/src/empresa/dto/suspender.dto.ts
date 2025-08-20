import { IsNotEmpty, IsString } from 'class-validator';
export class SuspenderDto {
  @IsString() @IsNotEmpty()
  motivo!: string;
}

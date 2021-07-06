import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchLocationDTO {
  @ApiProperty({ example: 'Colum', description: 'Partial location name' })
  @IsNotEmpty()
  readonly keyword: string;
}

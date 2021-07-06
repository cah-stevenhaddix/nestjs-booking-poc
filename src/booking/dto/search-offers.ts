import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsISO8601,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { AmadeusRequest } from '../amadeus/amadeus.definitions';
import { LatLngLiteral } from './locations';

export class SearchOffers extends AmadeusRequest {
  @ApiProperty({
    example: 'Saenger Theatre',
    description: 'Point of interest to search for bookings near',
  })
  @IsDefined()
  readonly pointOfInterest: string;

  @ApiProperty({
    description:
      'Contains the geocoded latitude,longitude value for this location. Note: pointOfInterest will resolve to a lat/long if not provided.',
    type: LatLngLiteral,
  })
  @IsOptional()
  @ValidateNested()
  geometry: LatLngLiteral;

  @ApiProperty({
    example: '2021-06-07',
    description: 'ISO 8601 formatted date string',
  })
  @IsISO8601()
  readonly checkInDate: string;

  @ApiProperty({
    example: '2021-06-07',
    description: 'ISO 8601 formatted date string',
  })
  @IsISO8601()
  readonly checkOutDate: string;

  @ApiProperty({
    example: '1',
    description: 'Number of rooms needed at the property',
  })
  @IsInt()
  @Min(1)
  @Max(9)
  readonly rooms: number = 1;

  @ApiProperty({ example: '2', description: 'Number of adults per room' })
  @IsInt()
  @Min(1)
  @Max(9)
  readonly adults: number = 2;

  @ApiProperty({ example: 5, description: 'Hotel rating between 1-5' })
  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @ApiProperty({
    example: 15,
    description: 'Distance in miles to search for hotel',
  })
  @IsInt()
  @Min(1)
  @Max(100)
  readonly distance: number = 15;
}

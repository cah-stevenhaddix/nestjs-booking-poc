import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export enum Type {
  CITY = 'CITY',
  AIRPORT = 'AIRPORT',
}

export class LatLngLiteral {
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;
}

export class Location {
  @ApiProperty({ example: 'RICKENBACKER INTL', description: 'Location Name' })
  @IsNotEmpty()
  name: string;

  city?: string;

  state?: string;

  @ApiProperty({
    description:
      'Contains the geocoded latitude,longitude value for this location',
    type: LatLngLiteral,
  })
  @IsNotEmpty()
  @ValidateNested()
  geometry: LatLngLiteral;
}

export class LocationCode extends Location {
  @ApiProperty({
    example: 'location',
    description: 'Type of location',
    enum: Type,
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'CMH', description: 'City code' })
  @IsNotEmpty()
  cityCode: string;

  @ApiProperty({ example: 'LCK', description: 'Official IATA 3 digit code' })
  @IsNotEmpty()
  iataCode: string;
}

export class Locations {
  @ApiProperty()
  @IsNotEmpty()
  locations: Location[];
}

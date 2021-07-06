import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsISO8601,
  ValidateNested,
  IsDefined,
} from 'class-validator';

class Hotel {
  @ApiProperty({
    example: 'WV',
    description: 'Point of interest to search for bookings near',
  })
  @IsNotEmpty()
  readonly chainCode: string;

  @ApiProperty({
    example: 'MIA',
    description: 'Point of interest to search for bookings near',
  })
  @IsNotEmpty()
  readonly cityCode: string;

  @ApiProperty({
    example: '001',
    description: 'Point of interest to search for bookings near',
  })
  @IsNotEmpty()
  readonly hotelCode: string;
}

class Offer {
  @ApiProperty({
    example: '2017-06-07',
    description: 'ISO 8601 formatted date string',
  })
  @IsISO8601()
  readonly checkInDate: Date;

  @ApiProperty({
    example: '2017-06-07',
    description: 'ISO 8601 formatted date string',
  })
  @IsISO8601()
  readonly checkOutDate: Date;

  @IsNotEmpty()
  readonly ratePlanCode: string;

  @IsNotEmpty()
  readonly roomTypeCode: string;

  @IsNotEmpty()
  readonly roomCount: number;
}

export class EnhancedPricingSearch {
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  readonly hotel: Hotel;

  @IsNotEmpty()
  @ValidateNested()
  readonly offer: Offer;
}

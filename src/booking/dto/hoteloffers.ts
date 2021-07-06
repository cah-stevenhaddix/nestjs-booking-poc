import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPostalCode,
  Min,
  Max,
  IsInt,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import WrapperResponse from './wrapper-response';

export class Address {
  @ApiProperty({ example: '122 Street Drive' })
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Columbus' })
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'OH', description: 'State' })
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '43201', description: 'Postal code' })
  @IsPostalCode()
  postalCode: string;

  @ApiProperty({ example: 'US', description: 'Postal code' })
  @IsPostalCode()
  country: string;
}

export enum DistanceUnit {
  MI = 'MI',
  KM = 'KM',
}

class Distance {
  @ApiProperty({ example: '0.4', description: 'Hotel rating between 1-5' })
  @IsInt()
  distance: number;

  @ApiProperty({
    example: 'US',
    description: 'Postal code',
    enum: DistanceUnit,
  })
  @IsEnum(DistanceUnit)
  distanceUnit: DistanceUnit;
}

export class Offer {
  @ApiProperty({
    example: '2E5650829E01B8BD88085B597266F15EF03E6E23BC8DB1A470A6D03F8E2BA1A8',
    description: 'Offer ID used to reference offer',
  })
  @IsNotEmpty()
  bookingCode: string;

  @ApiProperty({
    example: 'DELUXE_ROOM',
    description: 'Category of room offer',
  })
  @IsNotEmpty()
  roomCategory: string;

  @ApiProperty({
    example:
      'Regular Rate\nDeluxe Room garden or patio view, walk-in close\nt, large bathroom, 1 King or 2 Queen, 40sqm/430',
    description: 'Description of the hotel room offer',
  })
  @IsNotEmpty()
  roomDescription: string;

  @ApiProperty({ example: 125.5, description: 'Price per room before tax' })
  @IsNotEmpty()
  pricePerRoom: number;

  @ApiProperty({ example: 251, description: 'Total for all rooms after tax' })
  @IsNotEmpty()
  priceTotal: number;
}

export class HotelMedia {
  @ApiProperty({
    example:
      'http://pdt.multimediarepository.testing.amadeus.com/cmr/retrieve/hotel/B6AA0C7920214C49AAFBCFFF32A15300',
    description: 'Image URI for hotel exterior',
  })
  @IsNotEmpty()
  uri?: string;

  @ApiProperty({ example: 'Lobby', description: 'Description of image type' })
  @IsNotEmpty()
  category?: string;
}

export class Hotel {
  @ApiProperty({ example: 'Hyatt', description: 'Name of hotel' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'WVMIA001', description: 'Hotel code' })
  @IsNotEmpty()
  hotelCode: string;

  @ApiProperty({ example: 'WV', description: 'Name of hotel' })
  @IsNotEmpty()
  chainCode: string;

  @ApiProperty({ example: 'MIA', description: 'Name of hotel' })
  @IsNotEmpty()
  cityCode: string;

  @ApiProperty({ example: 5, description: 'Hotel rating between 1-5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ type: Distance })
  @ValidateNested()
  distance: Distance;

  @ApiProperty({
    description: 'Image URIs associated with hotel',
    type: HotelMedia,
  })
  @ValidateNested()
  media: HotelMedia[];

  @ApiProperty({
    description: 'Address of the hotel being offered',
    type: Address,
  })
  @IsNotEmpty()
  address: Address;
}

export class HotelOffer {
  @ApiProperty({ description: 'Hotel details', type: Hotel })
  @ValidateNested()
  hotel: Hotel;

  @ApiProperty({ description: 'List of offers', type: [Offer] })
  @ValidateNested()
  offers: Offer[];
}

export class HotelOffers extends WrapperResponse {
  @ApiProperty()
  @ValidateNested()
  hotelOffers: HotelOffer[];
}

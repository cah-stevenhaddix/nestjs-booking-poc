import { ApiProperty } from '@nestjs/swagger';
import { ContactObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsISO8601,
  ValidateNested,
  IsEmail,
  IsPhoneNumber,
  IsDefined,
} from 'class-validator';
import { Session } from '../amadeus/amadeus.definitions';
import { LatLngLiteral } from './locations';
import WrapperRequest from './wrapper-request';

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

class Booking {
  @ApiProperty({
    example: 'A1DS70',
    description: 'Point of interest to search for bookings near',
  })
  @IsNotEmpty()
  readonly bookingCode: string;

  @ApiProperty({ example: '1', description: 'Guaranteed = 1 or Deposit = 2' })
  @IsNotEmpty()
  readonly paymentCode: string;
}

export class Contact {
  @ApiProperty({
    example: 'soandso@gmail.com',
    description: 'Email address of person making the booking',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of person doing the booking',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of person doing the booking',
  })
  @IsPhoneNumber('US')
  readonly phoneNumber: string;
}

export class BookOffer extends WrapperRequest {
  @IsNotEmpty()
  @ValidateNested()
  readonly hotel: Hotel;

  @IsNotEmpty()
  @ValidateNested()
  readonly booking: Booking;

  @IsNotEmpty()
  @ValidateNested()
  readonly contact: Contact;
}

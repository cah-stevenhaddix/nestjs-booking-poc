import {
  Request,
  Get,
  Post,
  Query,
  Controller,
  Body,
  HttpCode,
  LoggerService,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BookingService } from './booking.service';
import { PayPalService } from './paypal.service';

import { SearchLocationDTO } from './dto/search-location';
import { Location, LocationCode, Locations } from './dto/locations';
import { HotelOffer, HotelOffers } from './dto/hoteloffers';
import { BookOffer } from './dto/book-offer';
import { SearchOffers } from './dto/search-offers';

@ApiBearerAuth()
@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly bookingService: BookingService,
    private readonly payPalService: PayPalService,
  ) {}

  @ApiOperation({ summary: 'Get venue location' })
  @ApiResponse({ status: 200, description: 'Return lis.', type: [Location] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('search/locations/venue')
  @HttpCode(200)
  async findVenueLocation(
    @Request() req,
    @Query('venueName') venueName: string,
  ): Promise<Locations> {
    return await this.bookingService.findGeoLocation(venueName);
  }

  @ApiOperation({ summary: 'Get suggested locations' })
  @ApiResponse({
    status: 200,
    description: 'Return locations.',
    type: [LocationCode],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('search/locations')
  async getLocations(@Query() query: SearchLocationDTO): Promise<Locations> {
    return await this.bookingService.findLocations(query.keyword);
  }

  @ApiOperation({ summary: 'Get hotel offers' })
  @ApiResponse({
    status: 200,
    description: 'Return list of hotel offers.',
    type: [HotelOffer],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('search/offers')
  @HttpCode(200)
  async findHotelOffers(
    @Body() searchOffers: SearchOffers,
  ): Promise<HotelOffers> {
    return await this.bookingService.findHotelOffers(searchOffers);
  }

  @ApiOperation({ summary: 'Place booking on offer' })
  @ApiResponse({ status: 200, description: 'Return success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('book/offer')
  async bookOffer(@Request() req, @Body() bookOffer: BookOffer): Promise<any> {
    const userId = req.user.uid;

    const booking = await this.bookingService.bookOffer(bookOffer);
    console.log(booking);

    const response = await this.bookingService.saveBooking(userId, {
      booking: {
        ...booking,
        ...bookOffer.booking,
      },
      contact: bookOffer.contact,
      hotel: bookOffer.hotel,
    });

    return response;
  }

  @ApiOperation({ summary: 'Get all bookings for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return success' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('user')
  async getBookings(@Request() req): Promise<any> {
    const userId = req.user.uid;
    return await this.bookingService.getBooking(userId);
  }

  @Get('queue/list')
  async listQueue(): Promise<any> {
    return await this.bookingService.listQueue();
  }

  @Get('payments/authorize')
  async authorize(@Query() query): Promise<any> {
    return await this.payPalService.createAuthorization(query.orderId);
  }
}

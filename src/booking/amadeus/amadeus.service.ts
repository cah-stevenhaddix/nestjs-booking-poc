import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Amadeus from 'amadeus';
import { LocationResponse, HotelOffersResponse } from './amadeus.definitions';

@Injectable()
export class AmadeusSelfService {
  constructor(private configService: ConfigService, private logger: Logger) {
    this.logger.setContext('AmadeusService');

    this.amadeusClient = new Amadeus({
      clientId: this.configService.get<string>('AMADEUS_CLIENT_ID'),
      clientSecret: this.configService.get<string>('AMADEUS_CLIENT_SECRET'),
    });
  }

  amadeusClient;

  async findLocations(
    keyword: string,
    type?: Amadeus.location,
  ): Promise<LocationResponse> {
    return this.amadeusClient.referenceData.locations.get({
      keyword: keyword,
      subType: type ? type : Amadeus.location.any,
    });
  }

  async findHotelOffers(searchParameters): Promise<HotelOffersResponse> {
    return this.amadeusClient.shopping.hotelOffers.get(searchParameters);
  }
}

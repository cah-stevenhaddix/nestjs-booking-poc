import { Injectable, Logger, LoggerService, Inject } from '@nestjs/common';
import { FirebaseDatabaseService } from '@aginix/nestjs-firebase-admin';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppLogger } from '../logger.service';
import { AmadeusSelfService } from './amadeus/amadeus.service';
import { GoogleMapsService } from './googlemaps.service';
import { Locations, Location } from './dto/locations';
import { HotelOffers } from './dto/hoteloffers';
import { SearchOffers } from './dto/search-offers';
import { BookOffer } from './dto/book-offer';

@Injectable()
export class BookingService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly amadeusSelfService: AmadeusSelfService,
    private googleMapsService: GoogleMapsService,
    private firebaseDatabaseService: FirebaseDatabaseService,
  ) {
    (logger as WinstonLogger).setContext('BookingService');
  }

  async findGeoLocation(keyword: string): Promise<Locations> {
    try {
      const res = await this.googleMapsService.findPlaceFromText(keyword);
      const candidates = res.data.candidates;

      const locationCalls = candidates.map(
        async (canidate): Promise<Location> => {
          const place = await this.googleMapsService.findPlace(
            canidate.place_id,
          );
          const state = this.googleMapsService.extractFromAddress(
            place.data.result.address_components,
            'administrative_area_level_1',
          );
          const city = this.googleMapsService.extractFromAddress(
            place.data.result.address_components,
            'locality',
          );

          return {
            name: canidate.name,
            city: city ? city.short_name : '',
            state: state ? state.long_name : '',
            geometry: {
              lat: canidate.geometry.location.lat,
              lng: canidate.geometry.location.lng,
            },
          };
        },
      );

      return Promise.all(locationCalls).then((res) => {
        return {
          locations: res,
        };
      });
    } catch (err) {
      this.logger.error(err.data);
    }
  }

  async findLocations(keyword: string): Promise<Locations> {
    try {
      const res = await this.amadeusSelfService.findLocations(keyword, 'CITY');

      return {
        locations: res.data.map((location) => ({
          type: location.subType,
          name: location.name,
          cityCode: location.address.cityCode,
          iataCode: location.iataCode,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          city: location.address.cityName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          state: location.address.stateCode,
          geometry: {
            lat: location.geoCode.latitude,
            lng: location.geoCode.longitude,
          },
        })),
      };
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findHotelOffers(searchOffers: SearchOffers): Promise<HotelOffers> {
    return this.amadeusSelfService.findHotelOffers(sear);
  }

  async bookOffer(bookOffer: BookOffer): Promise<any> {
    try {
      const session = this.amadeusSelfService.bookOffer(
        bookOffer.session.sessionId,
      );
    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  async saveBooking(userId, bookingData): Promise<any> {
    try {
      await this.firebaseDatabaseService.database
        .ref(`amadeus/booking/${userId}/`)
        .push(bookingData);

      return bookingData;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getBooking(userId): Promise<any> {
    try {
      const bookings = await this.firebaseDatabaseService.database
        .ref(`amadeus/booking/${userId}/`)
        .once('value');

      return bookings;
    } catch (err) {
      this.logger.error(err);
    }
  }
}

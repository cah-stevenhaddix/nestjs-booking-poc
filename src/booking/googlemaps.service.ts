import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  FindPlaceFromTextResponse,
  PlaceInputType,
  PlaceDetailsResponse,
  AddressComponent,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class GoogleMapsService {
  constructor(private configService: ConfigService, private logger: Logger) {
    this.logger.setContext('GoogleMapsService');
  }

  googleMapsClient = new Client();

  async findPlaceFromText(input: string): Promise<FindPlaceFromTextResponse> {
    return this.googleMapsClient.findPlaceFromText({
      params: {
        input: input,
        inputtype: PlaceInputType.textQuery,
        key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      },
    });
  }

  async findPlace(placeId: string): Promise<PlaceDetailsResponse> {
    return this.googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
        fields: ['place_id', 'address_component'],
      },
    });
  }

  extractFromAddress(components: AddressComponent[], type): AddressComponent {
    let component: AddressComponent;
    let index = 0;

    while (!component && components[index]) {
      const c = components[index];

      if (Array.isArray(c.types) && c.types.includes(type)) {
        component = c;
      }

      index = index + 1;
    }

    return component;
  }
}

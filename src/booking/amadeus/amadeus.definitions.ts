export class PNR {
  controlNumber: string;
}

export class EnhancedOffer {
  hotel: {
    hotelCode: string;
    chainCode: string;
    cityCode: string;
  };
  offer: {
    bookingCode: string;
    checkInDate: string;
    checkOutDate: string;
    ratePlanCode: string;
    roomTypeCode: string;
    roomCount: number;
  };
}

export class AuthResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

export class LocationResponse {
  data: [
    {
      type: string;
      subType: string;
      name: string;
      detailedName: string;
      id: string;
      timeZoneOffset: string;
      iataCode: string;
      geoCode: {
        latitude: number;
        longitude: number;
      };
      address: {
        cityCode: string;
      };
    },
  ];
}

export declare enum DistanceUnit {
  MI = 'MI',
  KM = 'KM',
}

export class Media {
  uri: string;
  category: string;
}

export class Price {
  perRoom?: number;
  currency: string;
  base: string;
  total: number;
}

export class Offer {
  bookingCode: string;
  roomCount: number;
  checkInDate: string;
  checkOutDate: string;
  ratePlanCode: string;
  roomTypeCode: string;
  paymentCode: number;
  room: {
    typeEstimated: {
      category: string;
      beds?: number;
      bedType: string;
    };
    description: {
      text: string;
    };
  };
  price: Price;
}

export class Hotel {
  type: string;
  hotelCode: string;
  chainCode: string;
  name: string;
  rating: number;
  cityCode: string;
  latitude: number;
  longitude: number;
  distance: {
    distance: number;
    distanceUnit: DistanceUnit;
  };
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    state: string;
  };
  media: Media[];
}

export class HotelOffers {
  type: string;
  hotel: Hotel;
  roomOffers: Offer[];
}

export class SessionId {
  sessionId: string;
}

export class SessionSecret {
  sequenceNumber: number;
  securityToken: string;
}

export class Session {
  sessionId: string;
  sequenceNumber;
  securityToken: string;
  createdAt: string;
}

export class AmadeusRequest {
  session?: SessionId;
}

export class AmadeusResponse {
  session?: SessionId;
}

export class HotelOffersResponse extends AmadeusResponse {
  offers: HotelOffers[];
}

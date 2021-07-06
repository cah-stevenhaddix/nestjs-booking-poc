import { Module, HttpModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AmadeusSelfService } from './amadeus/selfservice/amadeus.service';
import {
  AmadeusService,
  AmadeusSessionService,
} from './amadeus/enterprise/amadeus.service';

import { GoogleMapsService } from './googlemaps.service';
import { PayPalService } from './paypal.service';

import { AmadeusSessionManager } from './amadeus/enterprise/amadeus.session.manager';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    Logger,
    BookingService,
    AmadeusSelfService,
    AmadeusService,
    AmadeusSessionService,
    AmadeusSessionManager,
    GoogleMapsService,
    PayPalService,
  ],
  controllers: [BookingController],
  exports: [AmadeusSessionManager],
})
export class BookingModule {}

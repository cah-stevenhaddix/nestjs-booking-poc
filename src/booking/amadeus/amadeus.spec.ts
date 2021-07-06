import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingController } from '../booking.controller';
import { BookingService } from '../booking.service';
import { AmadeusSelfService } from './amadeus.service';
import { AppLogger } from '../../logger.service';

describe('AmadeusService', () => {
  let amadeusService: AmadeusService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [BookingService, AmadeusSelfService, AppLogger],
      controllers: [BookingController],
    }).compile();

    amadeusService = moduleRef.get<AmadeusSelfService>(AmadeusSelfService);
  });

  describe.skip('isTokenExpired', () => {
    it('should return true when token has expired', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2019-05-14T00:30:00.00Z').valueOf(),
        );

      const token = new AuthResponse();
      token.expires_in = 1799;

      expect(
        amadeusService.isTokenExpired(
          token,
          new Date('2019-05-14T00:00:00.00Z'),
        ),
      ).toBe(true);
    });

    it('should return true when token has not been issued yet', async () => {
      expect(amadeusService.isTokenExpired(undefined, undefined)).toBe(true);
    });

    it('should return false when token is valid', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2019-05-14T00:29:00.00Z').valueOf(),
        );

      const token = new AuthResponse();
      token.expires_in = 1799;

      expect(
        amadeusService.isTokenExpired(
          token,
          new Date('2019-05-14T00:00:00.00Z'),
        ),
      ).toBe(false);
    });
  });
});

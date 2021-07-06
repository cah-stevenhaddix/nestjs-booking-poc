import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiError,
  Card,
  Client,
  CompletePaymentResponse,
  CreateCustomerCardResponse,
  Customer,
  Environment,
  ListCardsResponse,
} from 'square';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SquareService {
  constructor(private configService: ConfigService, private logger: Logger) {
    this.logger.setContext('SquareService');
  }

  squareClient = new Client(this.environment());

  environment() {
    const accessToken = this.configService.get<string>('SQUARE_ACCESS_TOKEN');

    return {
      environment:
        process.env.NODE_ENV === 'production'
          ? Environment.Production
          : Environment.Sandbox,
      accessToken,
    };
  }

  async getCards(customerId): Promise<ListCardsResponse> {
    const { result } = await this.squareClient.cardsApi.listCards(
      undefined,
      customerId,
    );
    return result;
  }

  async createCustomer(
    customer: Customer,
    idempotencyKey: string,
  ): Promise<CreateCustomerCardResponse> {
    // To create a customer, you only need 1 of 5 identity values but you'll be
    // specifying two.
    const requestBody = {
      idempotencyKey: idempotencyKey, // A unique id for the request
      givenName: customer.givenName,
      familyName: customer.familyName,
    };

    try {
      const { result } = await this.squareClient.customersApi.createCustomer(
        requestBody,
      );
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error.errors);
      } else {
        console.log('Unexpected Error: ', error);
      }
    }
  }

  async completePayment(paymentId: string): Promise<CompletePaymentResponse> {
    const { result, ...httpResponse } =
      await this.squareClient.paymentsApi.completePayment(paymentId);
    return result;
  }
}

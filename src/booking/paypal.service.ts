import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { core, orders, payments } from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  constructor(private configService: ConfigService, private logger: Logger) {
    this.logger.setContext('PayPalService');
  }

  payPalClient = new core.PayPalHttpClient(this.environment());

  environment() {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    if (process.env.NODE_ENV === 'production') {
      return new core.LiveEnvironment(clientId, clientSecret);
    }

    return new core.SandboxEnvironment(clientId, clientSecret);
  }

  async getRequest(orderId): Promise<any> {
    const request = new orders.OrdersGetRequest(orderId);

    return await this.payPalClient.execute(request);
  }

  async createAuthorization(orderId): Promise<string> {
    const request = new orders.OrdersAuthorizeRequest(orderId);

    request.requestBody({});

    const authorization = await this.payPalClient.execute(request);

    const authorizationId =
      authorization.result.purchase_units[0].payments.authorizations[0].id;

    return authorizationId;
  }

  async captureAuthoization(authorizationId: string): Promise<string> {
    const request = new payments.AuthorizationsCaptureRequest(authorizationId);

    request.requestBody({});

    const capture = await this.payPalClient.execute(request);

    return capture.result.id;
  }
}

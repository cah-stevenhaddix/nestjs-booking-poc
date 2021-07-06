import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';

export class AuthGuard implements CanActivate {
  constructor(private logger: Logger) {
    this.logger.setContext('AuthGuard');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    const idToken = authorization.replace('Bearer ', '');

    try {
      request.user = await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (err) {
      if (err.errorInfo.code === 'auth/id-token-expired') {
        this.logger.verbose('Firebase auth/id-token-expired');
        return false;
      }

      throw err;
    }

    return true;
  }
}

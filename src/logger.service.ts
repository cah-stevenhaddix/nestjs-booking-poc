import { Injectable, Scope, Logger } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends WinstonLogger {}

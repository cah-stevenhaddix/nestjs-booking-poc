import { Module, HttpModule, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import { TasksModule } from './tasks/tasks.module';
import { BookingModule } from './booking/booking.module';
import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';
import * as clc from 'cli-color';
import safeStringify from 'fast-safe-stringify';

const nestLikeColorScheme = {
  info: clc.greenBright,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

const logPrinter = (appName) =>
  format.printf(({ context, level, timestamp, message, stack, ...meta }) => {
    const color = nestLikeColorScheme[level] || ((text) => text);

    return (
      `${color(`[${appName}]`)} ` +
      `${clc.yellow(level.charAt(0).toUpperCase() + level.slice(1))} - ` +
      ('undefined' !== typeof timestamp
        ? `${new Date(timestamp).toLocaleString()} `
        : '') +
      ('undefined' !== typeof context
        ? `${clc.yellow('[' + context + ']')} `
        : '') +
      `${color(message)}` +
      ` - ${safeStringify(meta)}` +
      (stack ? `\n${stack}` : '')
    );
  });

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => ({
        format: format.combine(
          format.errors({ stack: true }),
          format.timestamp(),
          logPrinter('Valise API'),
        ),
        transports: [
          new transports.Console(),
          new transports.File({
            filename: 'errors.log',
            level: 'debug',
            format: format.combine(format.uncolorize()),
          }),
        ],
      }),
    }),
    BookingModule,
    HttpModule,
    ConfigModule.forRoot(),
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.applicationDefault(),
        databaseURL: '<INSERT DATABASE URL>',
      }),
    }),
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  providers: [Logger],
})
export class AppModule {}

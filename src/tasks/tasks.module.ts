import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { BookingModule } from 'src/booking/booking.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [BookingModule, FirebaseAdminModule],
  providers: [TasksService],
})
export class TasksModule {}
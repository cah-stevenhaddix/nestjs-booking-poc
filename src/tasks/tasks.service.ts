import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AmadeusSessionManager } from '../booking/amadeus/enterprise/amadeus.session.manager';


@Injectable()
export class TasksService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
        private amadeusSessionManager: AmadeusSessionManager,
    ) {}

    @Interval(300000)
    handleInterval() {
        this.logger.log('Checking Amadeus session pool', TasksService.name)
        let shouldUpdate = false;

        const sessionPool = this.amadeusSessionManager.getSessions()

        Object.keys(sessionPool).forEach(key => {
            const session = sessionPool[key]

            const createdAtDate = new Date(session.createdAt)
            const currentDate = new Date()

            createdAtDate.setMinutes( createdAtDate.getMinutes() + 15 )

            if (createdAtDate < currentDate) {
                shouldUpdate = true;
                delete sessionPool[key]
            }
        })

        if (shouldUpdate) {
            this.amadeusSessionManager.setSessionPool(sessionPool)
        }
    }
}
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Seat } from 'src/seats/seats.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly url = 'http://localhost:8080';
    constructor(
        @InjectRepository(Seat)
        private readonly seatsService: Repository<Seat>,
        private readonly http: HttpService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkSeats() {
        const emptySeats = await this.seatsService.find({
            where: {isOccupied: false},
            relations: ['users']
        });
    
        for (const seat of emptySeats) {
            for (const user of seat.users) {
                await this.sendHttpNotification(user, seat);
            }
        }
    }

    private async sendHttpNotification(user: User, seat: Seat) {
        try {
            await firstValueFrom(
                this.http.post(this.url, {message: `:: seat ${seat.name} is now available`})
            );
        } catch(error) {
            console.error(error);
        }
    }
}

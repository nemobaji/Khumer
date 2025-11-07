import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Seat } from './seats.entity';

@Injectable()
export class SeatsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>
    ) {}

    async reserveSeat(userId: number, seatId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            relations: ['seats'],
        });
        const seat = await this.seatRepository.findOne({where: { name: seatId }});

        if (!user) throw new NotFoundException(':: user not found');
        if (!seat) throw new NotFoundException(':: seat not found');

        user.seats.push(seat);
        return this.userRepository.save(user);
    }

    async cancelSeat(userId: number, seatId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['seats'],
        });

        if(!user) throw new NotFoundException(':: user not found');
        user.seats = user.seats.filter((seat) => seat.name !== seatId);

        return this.userRepository.save(user);
    }
}

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

    async reserveSeat(userId: number, seatId: number, location: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            relations: ['seats'],
        });
        const seat = await this.seatRepository.findOne({where: { name: seatId, location: location }});

        if (!user) throw new NotFoundException(':: user not found');
        if (!seat) throw new NotFoundException(':: seat not found');

        user.seats.push(seat);
        return this.userRepository.save(user);
    }

async cancelSeat(userId: number, seatId: number, location: string): Promise<User> {
    const user = await this.userRepository.findOne({
        where: { id: userId }, 
        relations: ['seats'],  
    });

    if (!user) {
        throw new NotFoundException(':: user not found');
    }
    const isReserved = user.seats.some(
        (seat) => seat.name === seatId && seat.location === location
    );
    if (!isReserved) {
        throw new NotFoundException(':: specified seat is not currently reserved by this user.');
    }
    user.seats = user.seats.filter(
        (seat) => !(seat.name === seatId && seat.location === location)
    );
    return this.userRepository.save(user);
}

    async getSeatByLocation() {
        const seat = await this.seatRepository.find();
        const map = new Map<string, {occupied: number, avaliable: number}>();

        seat.forEach(seat => {
            const loc = seat.location;

            if(!map.has(loc)) {
                map.set(loc, {occupied: 0, avaliable: 0});
            }

            const group = map.get(loc)!;

            if(seat.isOccupied) {
                group.occupied++;
            } else {
                group.avaliable++;
            }
        });

        const response =  Array.from(map.entries()).map(([name, data]) => ({
            name,
            occupied: data.occupied,
            available: data.avaliable,
        }));

        return response;
    }

    async getSeatState(location: string) {
        const seats = await this.seatRepository.find({
            where: {location: location},
            select: ['name', 'isOccupied']
        });

        return this.transformSeatData(seats);
    }

    private transformSeatData(seats: Seat[]) {
        const occupied: number[] = [];
        const available: number[] = [];

        for (const seat of seats) {
            if(seat.isOccupied) {
                occupied.push(seat.name);
            } else {
                available.push(seat.name);
            }
        }

        return [{
            occupied: occupied,
            available: available
        }];
    } 
}

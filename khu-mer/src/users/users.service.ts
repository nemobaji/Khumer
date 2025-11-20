import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(userName: string, userEmail: string) {
        const name = userName;
        const email = userEmail;

        const user = this.userRepository.create({name, email});
        await this.userRepository.save(user);

        return {
            id: user.id,
            name: user.name
        };
    }

    async loginUser(userName: string, userEmail: string) {
        const name = userName;
        const email = userEmail;
        const user = await this.userRepository.findOne({
            where: {name: name, email: email}
        });

        return {
            id: user?.id,
            name: user?.name
        };
    }

    async getReservation(id: number) {
        const user = await this.userRepository.findOne({
            where: {id: id},
            relations: ['seats']
        });

        if(!user) throw new NotFoundException(':: user not found');

        return user.seats.map((seat) => ({
            name: seat.name,
            location: seat.location,
            isOccupied: seat.isOccupied,
            expiredTime: seat.expiredTime
        }));
    }
}


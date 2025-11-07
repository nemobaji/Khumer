import { Injectable } from '@nestjs/common';
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
        return await this.userRepository.save(user);
    }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { Seat } from './seats.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Seat])],
  controllers: [SeatsController],
  providers: [SeatsService]
})
export class SeatsModule {}

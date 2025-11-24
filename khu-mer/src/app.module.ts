import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { SeatsModule } from './seats/seats.module';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ScheduleModule.forRoot(),
    SeatsModule,
    UsersModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

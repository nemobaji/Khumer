import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Seat } from 'src/seats/seats.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([User, Seat]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'hunwoo10121012@gmail.com',
          pass: 'pqso chqr htuc czvi'
        }
      },
      defaults: {
        from: '<hunwoo10121012@gmail.com>'
      }
    })
  ]
})
export class NotificationModule {}

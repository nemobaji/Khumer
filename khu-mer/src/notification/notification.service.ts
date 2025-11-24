import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/seats/seats.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatsRepository: Repository<Seat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkSeat() {
    const emptySeats = await this.seatsRepository.find({
      where: { isOccupied: false },
      relations: ['users'],
    });

    for (const seat of emptySeats) {
      for (const user of seat.users) {
        await this._sendMailNotification(user, seat);
      }
    }
  }

  private async _sendMailNotification(user: User, seat: Seat) {
    const seatLocation = this.changeRoomName(seat.location);
    await this.mailerService.sendMail({
      to: user.email,
      subject: `⏰쿠머 ${seat.name} 좌석 알림`,
      html: `
        <h3>안녕하세요 ${user.name}님,</h3>
        <p>${seatLocation} ${seat.name}번 좌석이 현재 비어있습니다.</p>
        <p>지금 바로 이용하실 수 있어요!</p>
      `,
    });

    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['seats'],
    });

    if (!fullUser) return;

    fullUser.seats = fullUser.seats.filter(s => s.id !== seat.id);

    await this.userRepository.save(fullUser);
  }

  private changeRoomName(index: string): string {
    let roomName = 'Unknown';

    switch (index) {
        case '1':
        roomName = '1F 제1열람실';
        break;
        case '2':
        roomName = '1F 집중열람실';
        break;
        case '3':
        roomName = '2F 제2열람실';
        break;
        case '4':
        roomName = '2F 제3열람실';
        break;
        case '5':
        roomName = '4F 제4열람실';
        break;
        case '12':
        roomName = '4F 제4열람실(대학원)';
        break;
        case '8':
        roomName = '1F 제1열람실(국제)';
        break;
        case '10':
        roomName = '1F 벗터';
        break;
        case '11':
        roomName = '2F 혜윰';
        break;
        case '9':
        roomName = '2F 제2열람실(국제)';
        break;
    }

    return roomName;
  }
}


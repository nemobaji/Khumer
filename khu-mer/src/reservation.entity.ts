import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './users/users.entity';
import { Seat } from './seats/seats.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Seat, (seat) => seat.reservations)
  seat: Seat;

  @Column({ type: 'bigint', nullable: true })
  expireTime: number | null;
}

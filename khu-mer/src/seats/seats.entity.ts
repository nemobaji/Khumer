import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Reservation } from "src/reservation.entity";

@Entity()
export class Seat extends BaseEntity {
    @PrimaryColumn()
    name: number;

    @Column({type: 'bigint', nullable: true})
    seatTime: number| null;

    @OneToMany(() => Reservation, (reservation) => reservation.seat)
    reservations: Reservation[];
}


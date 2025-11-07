import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "src/seats/seats.entity";


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @ManyToMany(() => Seat, (seat) => seat.users)
    @JoinTable()
    seats: Seat[];
}
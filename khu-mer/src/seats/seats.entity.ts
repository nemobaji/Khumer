import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { User } from "src/users/users.entity";

@Entity()
export class Seat extends BaseEntity {
    @PrimaryColumn()
    name: number;

    @Column()
    isOccupied: boolean;

    @ManyToMany(() => User, (user) => user.seats)
    users: User[];
}


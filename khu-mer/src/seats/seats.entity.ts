import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "src/users/users.entity";

@Entity()
@Unique(["name", "location"])
export class Seat extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: number;

    @Column()
    location: string;

    @Column()
    isOccupied: boolean;

    @Column({type: "bigint", nullable: true})
    expiredTime: string;

    @ManyToMany(() => User, (user) => user.seats)
    users: User[];
}


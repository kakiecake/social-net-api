import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserModel {
    @PrimaryColumn()
    tag!: string;

    @Column()
    fullName!: string;

    @Column()
    createdAt!: number;

    @Column()
    passwordHash!: string;

    @Column()
    passwordSalt!: string;
}

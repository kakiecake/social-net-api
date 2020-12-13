import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class PostModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    text!: string;

    @Index()
    @Column()
    authorTag!: string;

    @Column()
    createdAt!: number;
}

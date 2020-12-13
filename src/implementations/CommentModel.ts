import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class CommentModel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column()
    authorTag!: string;

    @Column()
    createdAt!: number;

    @Index()
    @Column()
    postId!: number;
}

import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity()
export class LikeModel {
    @PrimaryColumn()
    id!: number;

    @Index()
    @Column()
    type!: 'post' | 'comment';

    @Column()
    userTag!: string;
}

import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class LikeModel {
    @PrimaryColumn()
    postId!: number;

    @Column()
    userTag!: string;
}

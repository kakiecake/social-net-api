import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SubscriptionModel {
    @PrimaryColumn()
    subscriber!: string;

    @PrimaryColumn()
    subscribedTo!: string;
}

import { ISubscriptionRepository } from '../modules/subscriptions/ISubscriptionRepository';
import { Repository, Connection } from 'typeorm';
import { SubscriptionModel } from './SubscriptionModel';

export class SubscriptionRepository implements ISubscriptionRepository {
    private _subscriptions: Repository<SubscriptionModel>;

    constructor(connection: Connection) {
        this._subscriptions = connection.getRepository(SubscriptionModel);
    }

    async addSubcription(
        userTag: string,
        subscribeToTag: string
    ): Promise<boolean> {
        const subscribedUser = await this._subscriptions.findOne({
            subscriber: userTag,
            subscribedTo: subscribeToTag,
        });
        if (subscribedUser) return false;

        const subscription = new SubscriptionModel();
        subscription.subscriber = userTag;
        subscription.subscribedTo = subscribeToTag;
        this._subscriptions.save(subscription);
        return true;
    }

    async deleteSubctiption(
        userTag: string,
        subscribeToTag: string
    ): Promise<boolean> {
        const subscribedUser = await this._subscriptions.findOne({
            subscriber: userTag,
            subscribedTo: subscribeToTag,
        });
        if (!subscribedUser) return false;
        this._subscriptions.delete(subscribedUser);
        return true;
    }

    async getSubscribers(userTag: string): Promise<string[]> {
        const subscriptions = await this._subscriptions.find({
            subscribedTo: userTag,
        });
        return subscriptions.map(x => x.subscriber);
    }

    getSubscriberCount(userTag: string): Promise<number> {
        return this._subscriptions.count({ subscribedTo: userTag });
    }

    async getSubscribtions(userTag: string): Promise<string[]> {
        const subscriptions = await this._subscriptions.find({
            subscriber: userTag,
        });
        return subscriptions.map(x => x.subscribedTo);
    }

    getSubscribtionCount(userTag: string): Promise<number> {
        return this._subscriptions.count({
            subscriber: userTag,
        });
    }
}

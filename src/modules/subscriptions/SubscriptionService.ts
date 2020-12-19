import { ISubscriptionRepository } from './ISubscriptionRepository';
import { UserFacade } from '../users/UserFacade';

export class SubscriptionService {
    constructor(
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _usersModule: UserFacade
    ) {}

    async subscribe(userTag: string, subscribeToTag: string): Promise<boolean> {
        const [firstUserExists, secondUserExists] = await Promise.all([
            this._usersModule.doesUserExist(userTag),
            this._usersModule.doesUserExist(subscribeToTag),
        ]);
        if (!firstUserExists || !secondUserExists) return false;
        return this._subscriptionRepository.addSubcription(
            userTag,
            subscribeToTag
        );
    }

    async unsubscribe(
        userTag: string,
        subscribeToTag: string
    ): Promise<boolean> {
        return this._subscriptionRepository.deleteSubctiption(
            userTag,
            subscribeToTag
        );
    }

    async getSubscribers(userTag: string): Promise<string[]> {
        return this._subscriptionRepository.getSubscribers(userTag);
    }

    async getSubscriberCount(userTag: string): Promise<number> {
        return this._subscriptionRepository.getSubscriberCount(userTag);
    }

    async getSubscribtions(userTag: string): Promise<string[]> {
        return this._subscriptionRepository.getSubscribtions(userTag);
    }

    async getSubscribtionCount(userTag: string): Promise<number> {
        return this._subscriptionRepository.getSubscribtionCount(userTag);
    }
}

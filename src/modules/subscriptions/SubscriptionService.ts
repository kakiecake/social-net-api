import { ISubscriptionRepository } from './ISubscriptionRepository';
import { UserFacade } from '../users/UserFacade';

export class SubscriptionService {
    constructor(
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _usersModule: UserFacade
    ) {}

    async subscribe(userTag: string, subscribeToTag: string): Promise<boolean> {
        // userTag always points to an existing user
        const userExists = await this._usersModule.doesUserExist(
            subscribeToTag
        );
        if (userExists === false) return false;
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

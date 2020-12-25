import { SubscriptionService } from './SubscriptionService';
import { Inject, forwardRef } from '@nestjs/common';

export class SubscriptionFacade {
    constructor(
        @Inject(forwardRef(() => SubscriptionService))
        private readonly _subscriptionService: SubscriptionService
    ) {}

    subscribe(userTag: string, subscribeToTag: string): Promise<boolean> {
        return this._subscriptionService.subscribe(userTag, subscribeToTag);
    }

    unsubscribe(userTag: string, subscribeToTag: string): Promise<boolean> {
        return this._subscriptionService.unsubscribe(userTag, subscribeToTag);
    }

    getSubscribers(userTag: string): Promise<string[]> {
        return this._subscriptionService.getSubscribers(userTag);
    }

    getSubscriberCount(userTag: string): Promise<number> {
        return this._subscriptionService.getSubscriberCount(userTag);
    }

    getSubscribtions(userTag: string): Promise<string[]> {
        return this._subscriptionService.getSubscribtions(userTag);
    }

    getSubscribtionCount(userTag: string): Promise<number> {
        return this._subscriptionService.getSubscribtionCount(userTag);
    }
}

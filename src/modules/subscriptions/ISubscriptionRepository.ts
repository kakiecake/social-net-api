export interface ISubscriptionRepository {
    addSubcription(userTag: string, subscribeToTag: string): Promise<boolean>;
    deleteSubctiption(
        userTag: string,
        subscribeToTag: string
    ): Promise<boolean>;
    getSubscribers(userTag: string): Promise<string[]>;
    getSubscriberCount(userTag: string): Promise<number>;
    getSubscribtions(userTag: string): Promise<string[]>;
    getSubscribtionCount(userTag: string): Promise<number>;
}

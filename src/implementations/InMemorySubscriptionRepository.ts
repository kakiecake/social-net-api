export class InMemorySubscriptionRepository {
    private _subscriptions: Map<string, string[]> = new Map();

    async addSubcription(
        userTag: string,
        subscribeToTag: string
    ): Promise<boolean> {
        const subs = this._subscriptions.get(subscribeToTag);
        if (!subs) {
            this._subscriptions.set(subscribeToTag, [userTag]);
            return true;
        }
        if (!subs.find(tag => tag === userTag)) {
            subs.push(userTag);
            return true;
        }
        return false;
    }

    async deleteSubctiption(
        userTag: string,
        subscribeToTag: string
    ): Promise<boolean> {
        const subs = this._subscriptions.get(subscribeToTag);
        if (!subs) return false;
        const index = subs.findIndex(tag => tag === userTag);
        if (index === -1) return false;
        const subsUpdated = [
            ...subs.slice(0, index),
            ...subs.slice(index + 1, subs.length),
        ];
        this._subscriptions.set(subscribeToTag, subsUpdated);
        return true;
    }

    async getSubscribers(userTag: string): Promise<string[]> {
        return this._subscriptions.get(userTag) || [];
    }

    async getSubscriberCount(userTag: string): Promise<number> {
        return (this._subscriptions.get(userTag) || []).length;
    }

    async getSubscribtions(userTag: string): Promise<string[]> {
        const subscriptions = [];
        for (const [tag, subscribers] of this._subscriptions.entries()) {
            if (subscribers.includes(userTag)) subscriptions.push(tag);
        }
        return subscriptions;
    }

    async getSubscribtionCount(userTag: string): Promise<number> {
        return (await this.getSubscribtions(userTag)).length;
    }
}

import { SubscriptionFacade } from '../SubscriptionFacade';
import { SubscriptionService } from '../SubscriptionService';
import { UserFacade } from '../../users/UserFacade';
import { InMemorySubscriptionRepository } from '../../../implementations/InMemorySubscriptionRepository';

import faker from 'faker';
import { mock, when, instance, anyString } from 'ts-mockito';

describe('Subscription module tests', () => {
    let facade: SubscriptionFacade;

    beforeEach(async () => {
        const UserFacadeMock = mock(UserFacade);
        when(UserFacadeMock.doesUserExist(anyString())).thenResolve(true);
        when(UserFacadeMock.doesUserExist('@wronguser')).thenResolve(false);

        const userFacade = instance(UserFacadeMock);
        const repository = new InMemorySubscriptionRepository();
        const service = new SubscriptionService(repository, userFacade);
        facade = new SubscriptionFacade(service);
    });

    it('subscribes to user successfully', async () => {
        const userTag = '@' + faker.internet.userName();
        const subscribeToTag = '@' + faker.internet.userName();

        const success = await facade.subscribe(userTag, subscribeToTag);
        const subscribers = await facade.getSubscribers(subscribeToTag);
        const subscriptions = await facade.getSubscribtions(userTag);

        expect(success).toEqual(true);
        expect(subscribers).toContain(userTag);
        expect(subscriptions).toContain(subscribeToTag);
    });

    it('fails subscriptions if user does not exist', async () => {
        const userTag = '@' + faker.internet.userName();
        const subscribeToTag = '@wronguser';

        const success = await facade.subscribe(userTag, subscribeToTag);
        const subscribers = await facade.getSubscribers(subscribeToTag);
        const subscriptions = await facade.getSubscribtions(userTag);

        expect(success).toEqual(false);
        expect(subscribers).not.toContain(userTag);
        expect(subscriptions).not.toContain(subscribeToTag);
    });

    it('fails if user already subscribed', async () => {
        const userTag = '@' + faker.internet.userName();
        const subscribeToTag = '@' + faker.internet.userName();

        const success = await facade.subscribe(userTag, subscribeToTag);
        const fail = await facade.subscribe(userTag, subscribeToTag);
        const subscribers = await facade.getSubscribers(subscribeToTag);
        const subscriptions = await facade.getSubscribtions(userTag);

        expect(success).toEqual(success);
        expect(fail).toEqual(false);
        expect(subscribers).toContain(userTag);
        expect(subscriptions).toContain(subscribeToTag);
    });

    it('successfully unsubscribes', async () => {
        const userTag = '@' + faker.internet.userName();
        const subscribeToTag = '@' + faker.internet.userName();

        const subscribeSuccess = await facade.subscribe(
            userTag,
            subscribeToTag
        );
        const unsubscribeSuccess = await facade.unsubscribe(
            userTag,
            subscribeToTag
        );
        const subscribers = await facade.getSubscribers(subscribeToTag);
        const subscriptions = await facade.getSubscribtions(userTag);

        expect(subscribeSuccess).toEqual(true);
        expect(unsubscribeSuccess).toEqual(true);
        expect(subscribers).not.toContain(userTag);
        expect(subscriptions).not.toContain(subscribeToTag);
    });
});

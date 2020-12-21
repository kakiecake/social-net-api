import { UserService } from '../UserService';
import { SHA256HashingProvider } from '../../../implementations/SHA256HashingProvider';
import { InMemoryUserRepository } from '../../../implementations/InMemoryUserRepository';
import { UserFacade } from '../UserFacade';
import { SubscriptionFacade } from '../../subscriptions/SubscriptionFacade';

import faker from 'faker';
import { mock, anything, when, instance } from 'ts-mockito';

describe('Users module API tests', () => {
    let facade: UserFacade;
    beforeEach(() => {
        const SubscriptionFacadeMock = mock(SubscriptionFacade);
        when(SubscriptionFacadeMock.getSubscriberCount(anything())).thenResolve(
            10
        );
        when(
            SubscriptionFacadeMock.getSubscribtionCount(anything())
        ).thenResolve(10);

        const subscriptionsModule = instance(SubscriptionFacadeMock);
        const hashingProvider = new SHA256HashingProvider();
        const repository = new InMemoryUserRepository();
        const userService = new UserService(
            repository,
            hashingProvider,
            subscriptionsModule
        );
        facade = new UserFacade(userService);
    });

    describe('Register and login a user', () => {
        let tag: string, password: string, fullName: string;
        beforeEach(() => {
            tag = '@' + faker.internet.userName();
            password = faker.internet.password();
            fullName = faker.name.findName();
        });

        it('registers and logs in user without errors', async () => {
            const registerSuccess = await facade.registerUser(
                tag,
                fullName,
                password
            );
            const loginSuccess = await facade.loginUser(tag, password);
            expect(registerSuccess).toBe(true);
            expect(loginSuccess).toBe(true);
        });

        it('fails if user does not exist during login', async () => {
            const success = await facade.loginUser(tag, password);
            expect(success).toBe(false);
        });

        it('gets a user info', async () => {
            const success = await facade.registerUser(tag, fullName, password);
            const userInfo = await facade.getUserInfo(tag);

            expect(success).toBe(true);
            expect(userInfo).not.toBeNull();
            expect(userInfo!.subscriptions).toEqual(10);
            expect(userInfo!.subscribers).toEqual(10);
            expect(userInfo!.fullName).toEqual(fullName);
            expect(userInfo!.tag).toEqual(tag);
            expect(userInfo!.createdAt).toBeLessThan(Date.now());
        });
    });
});

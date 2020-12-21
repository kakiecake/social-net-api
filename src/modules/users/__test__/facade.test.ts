import { UserService } from '../UserService';
import { SHA256HashingProvider } from '../../../implementations/SHA256HashingProvider';
import { InMemoryUserRepository } from '../../../implementations/InMemoryUserRepository';
import { UserFacade } from '../UserFacade';

import faker from 'faker';

describe('Users module API tests', () => {
    let facade: UserFacade;
    beforeEach(() => {
        const hashingProvider = new SHA256HashingProvider();
        const repository = new InMemoryUserRepository();
        const userService = new UserService(repository, hashingProvider);
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
            const user1 = await facade.registerUser(tag, fullName, password);
            const user2 = await facade.loginUser(tag, password);

            expect(user1).not.toBeInstanceOf(Error);
            expect(user2).not.toBeNull();
            expect(user1).toEqual(user2);
            expect(user1).not.toBe(user2);
        });

        it('returns null if user does not exist during login', async () => {
            const user = await facade.loginUser(tag, password);
            expect(user).toBeNull();
        });
    });
});

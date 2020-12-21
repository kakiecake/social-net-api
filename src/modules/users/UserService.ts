import { UserTag, UserEntity } from './UserEntity';
import { IHashingProvider } from './UserFactory';
import { UserView } from './UserView';
import { IUserRepository } from './IUserRepository';
import { SubscriptionFacade } from '../subscriptions/SubscriptionFacade';

export type UserExistsError = Error;
export type UserNotFoundError = Error;

export class UserService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _hashingProvider: IHashingProvider,
        private readonly _subscriptions: SubscriptionFacade
    ) {}

    async registerUser(
        tag: UserTag,
        fullName: string,
        password: string
    ): Promise<boolean> {
        if ((await this._userRepository.findOne(tag)) !== null) return false;

        const passwordSalt = this._hashingProvider.generateSalt();
        const passwordHash = this._hashingProvider.hash(password, passwordSalt);
        const createdAt = Date.now();

        const user: UserEntity = {
            tag,
            fullName,
            passwordHash,
            passwordSalt,
            createdAt,
        };

        await this._userRepository.save(user);
        return true;
    }

    async loginUser(tag: UserTag, password: string): Promise<boolean> {
        const user = await this._userRepository.findOne(tag);
        if (user === null) return false;
        const correctHash = user.passwordHash;
        const salt = user.passwordSalt;
        const passwordHash = this._hashingProvider.hash(password, salt);
        return passwordHash === correctHash;
    }

    async doesUserExist(tag: UserTag): Promise<boolean> {
        return Boolean(this._userRepository.findOne(tag));
    }

    async getUserInfo(tag: UserTag): Promise<UserView | null> {
        const user = await this._userRepository.findOne(tag);
        if (user === null) return null;
        const [subscribers, subscriptions] = await Promise.all([
            this._subscriptions.getSubscriberCount(tag),
            this._subscriptions.getSubscribtionCount(tag),
        ]);
        return {
            tag: user.tag,
            fullName: user.fullName,
            createdAt: user.createdAt,
            subscribers,
            subscriptions,
        };
    }
}

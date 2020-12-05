import { UserEntity, UserTag } from '../entities/UserEntity';
import { UserFactory, IHashingProvider } from './UserFactory';

export interface IUserRepository {
    findOne(tag: string): Promise<UserEntity | null>;
    save(user: UserEntity): Promise<void>;
}

export class UserExistsError extends Error {}
export class UserNotFoundError extends Error {}

export class UserService {
    constructor(
        private readonly _userFactory: UserFactory,
        private readonly _userRepository: IUserRepository,
        private readonly _hashingProvider: IHashingProvider
    ) {}

    async registerUser(
        tag: UserTag,
        fullName: string,
        password: string
    ): Promise<UserEntity | UserExistsError> {
        if ((await this._userRepository.findOne(tag)) !== null)
            return new UserExistsError();
        const user = this._userFactory.createNewUser(fullName, tag, password);
        await this._userRepository.save(user);
        return user;
    }

    private _checkUserPassword(user: UserEntity, password: string): boolean {
        const correctHash = user.passwordHash;
        const salt = user.passwordSalt;
        const passwordHash = this._hashingProvider.hash(password, salt);
        return passwordHash === correctHash;
    }

    async loginUser(
        tag: UserTag,
        password: string
    ): Promise<UserEntity | null> {
        const user = await this._userRepository.findOne(tag);
        if (user && this._checkUserPassword(user, password)) {
            return user;
        } else {
            return null;
        }
    }
}

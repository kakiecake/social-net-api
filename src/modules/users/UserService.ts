import { UserEntity, UserTag } from './UserEntity';
import { UserFactory, IHashingProvider } from './UserFactory';
import { UserView } from './UserView';
import { IUserRepository } from './IUserRepository';

export type UserExistsError = Error;
export type UserNotFoundError = Error;

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
    ): Promise<UserView | UserExistsError> {
        if ((await this._userRepository.findOne(tag)) !== null)
            return new Error();
        const user = this._userFactory.createNewUser(fullName, tag, password);
        await this._userRepository.save(user);
        return this._userFactory.convertUserToDTO(user);
    }

    private _checkUserPassword(user: UserEntity, password: string): boolean {
        const correctHash = user.passwordHash;
        const salt = user.passwordSalt;
        const passwordHash = this._hashingProvider.hash(password, salt);
        return passwordHash === correctHash;
    }

    async loginUser(tag: UserTag, password: string): Promise<UserView | null> {
        const user = await this._userRepository.findOne(tag);
        if (user && this._checkUserPassword(user, password)) {
            return this._userFactory.convertUserToDTO(user);
        } else {
            return null;
        }
    }

    async doesUserExist(tag: UserTag): Promise<boolean> {
        return Boolean(this._userRepository.findOne(tag));
    }
}

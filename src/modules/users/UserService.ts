import { UserEntity, UserTag } from './UserEntity';
import { IHashingProvider } from './IHashingProvider';
import { UserView } from './UserView';
import { IUserRepository } from './IUserRepository';

export type UserExistsError = Error;
export type UserNotFoundError = Error;

export class UserService {
    constructor(
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

        const passwordSalt = this._hashingProvider.generateSalt();
        const passwordHash = this._hashingProvider.hash(password, passwordSalt);
        const createdAt = Date.now();

        await this._userRepository.save({
            tag,
            fullName,
            passwordHash,
            passwordSalt,
            createdAt,
        });

        return { tag, fullName, createdAt };
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
            return {
                tag: user.tag,
                fullName: user.fullName,
                createdAt: user.createdAt,
            };
        } else {
            return null;
        }
    }

    async doesUserExist(tag: UserTag): Promise<boolean> {
        return Boolean(this._userRepository.findOne(tag));
    }
}

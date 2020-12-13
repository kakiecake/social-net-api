import { UserTag, UserEntity } from './UserEntity';
import { UserView } from './UserView';

export interface IHashingProvider {
    generateSalt(): string;
    hash(str: string, salt: string): string;
}

export class UserFactory {
    constructor(private readonly _hashingProvider: IHashingProvider) {}

    public createNewUser(
        fullName: string,
        tag: UserTag,
        password: string
    ): UserEntity {
        const salt = this._hashingProvider.generateSalt();
        const hash = this._hashingProvider.hash(password, salt);
        const createdAt = Date.now();
        return new UserEntity(fullName, tag, hash, salt, createdAt);
    }

    public convertUserToDTO(user: UserEntity): UserView {
        return {
            tag: user.tag,
            fullName: user.fullName,
            createdAt: user.createdAt,
        };
    }

    public createUserFromDTO(
        fullName: string,
        tag: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: number
    ): UserEntity {
        return new UserEntity(
            fullName,
            tag,
            passwordHash,
            passwordSalt,
            createdAt
        );
    }
}
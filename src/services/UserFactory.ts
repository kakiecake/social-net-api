import { UserTag, UserEntity } from '../entities/UserEntity';
import { UserView } from '../dto/UserView';

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
}

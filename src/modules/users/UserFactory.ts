import { UserTag, UserEntity } from './UserEntity';

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
        const passwordSalt = this._hashingProvider.generateSalt();
        const passwordHash = this._hashingProvider.hash(password, passwordSalt);
        const createdAt = Date.now();
        return {
            fullName,
            tag,
            passwordSalt,
            passwordHash,
            createdAt,
        };
    }

    public createUserFromDTO(
        fullName: string,
        tag: string,
        passwordHash: string,
        passwordSalt: string,
        createdAt: number
    ): UserEntity {
        return { fullName, tag, passwordHash, passwordSalt, createdAt };
    }
}

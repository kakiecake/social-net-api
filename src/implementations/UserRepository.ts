import { IUserRepository } from '../modules/users/IUserRepository';
import { Repository, Connection } from 'typeorm';
import { UserModel } from './UserModel';
import { UserEntity } from '../modules/users/UserEntity';
import { UserFactory } from '../modules/users/UserFactory';

export class UserRepository implements IUserRepository {
    private readonly _users: Repository<UserModel>;

    constructor(
        private readonly _userFactory: UserFactory,
        connection: Connection
    ) {
        this._users = connection.getRepository(UserModel);
    }

    public async findOne(tag: string): Promise<UserEntity | null> {
        const user = await this._users.findOne(tag);
        if (!user) return null;
        return this._userFactory.createUserFromDTO(
            user.fullName,
            user.tag,
            user.passwordHash,
            user.passwordSalt,
            user.createdAt
        );
    }

    public async save(user: UserEntity): Promise<void> {
        await this._users.save({
            tag: user.tag,
            fullName: user.fullName,
            passwordSalt: user.passwordSalt,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
        });
    }
}

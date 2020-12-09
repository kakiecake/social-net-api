import { IUserRepository } from '../modules/users/IUserRepository';
import { UserEntity, UserTag } from '../modules/users/UserEntity';

export class InMemoryUserRepository implements IUserRepository {
    private _users: Map<UserTag, UserEntity> = new Map();

    public async findOne(tag: UserTag): Promise<UserEntity | null> {
        return this._users.get(tag) || null;
    }

    public async save(post: UserEntity): Promise<void> {
        this._users.set(post.tag, post);
    }

    public async delete(tag: UserTag): Promise<void> {
        this._users.delete(tag);
    }
}

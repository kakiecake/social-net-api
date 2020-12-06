import { IUserRepository } from '../services/UserService';
import { UserEntity, UserTag } from '../entities/UserEntity';
import { PostId } from '../entities/PostEntity';

export class InMemoryUserRepository implements IUserRepository {
    private _users: Map<UserTag, UserEntity> = new Map();

    public async findOne(tag: UserTag): Promise<UserEntity | null> {
        return this._users.get(tag) || null;
    }

    public async save(post: UserEntity): Promise<void> {
        this._users.set(post.tag, post);
    }

    public async delete(postId: PostId): Promise<void> {
        this._users.delete(postId);
    }
}

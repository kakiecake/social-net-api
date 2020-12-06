import { IPostRepository } from '../services/PostService';
import { PostEntity, PostId } from '../entities/PostEntity';
import { UserTag } from '../entities/UserEntity';

export class InMemoryPostRepository implements IPostRepository {
    private _posts: PostEntity[] = [];

    public async findOne(id: PostId): Promise<PostEntity | null> {
        return this._posts.find(post => post.id === id) || null;
    }

    public async save(post: PostEntity): Promise<PostEntity> {
        // no null checking needed here
        const lastId = this._posts[this._posts.length - 1].id as PostId;
        post.setId(lastId + 1);
        this._posts.push(post);
        return post;
    }

    public async delete(id: PostId) {
        this._posts = this._posts.filter(post => post.id !== id);
    }

    public async getPostsByUser(user: UserTag): Promise<PostEntity[]> {
        return this._posts.filter(post => post.author.tag === user);
    }
}

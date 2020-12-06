import { IPostRepository } from '../services/IPostRepository';
import { PostEntity, PostId } from '../entities/PostEntity';
import { UserTag } from '../entities/UserEntity';

export class InMemoryPostRepository implements IPostRepository {
    private _posts: PostEntity[] = [];

    public async findOne(id: PostId): Promise<PostEntity | null> {
        return this._posts.find(post => post.id === id) || null;
    }

    public async save(post: PostEntity): Promise<PostEntity> {
        if (post.id) {
            this._posts = this._posts.map(x => (x.id === post.id ? post : x));
        } else {
            const lastId =
                this._posts.length > 0
                    ? (this._posts[this._posts.length - 1].id as PostId)
                    : 0;
            post.setId(lastId + 1);
            this._posts.push(post);
        }
        return post;
    }

    public async deleteIfAuthorTagIsCorrect(
        id: PostId,
        authorTag: UserTag
    ): Promise<boolean> {
        const index = this._posts.findIndex(
            x => x.id === id && x.author.tag === authorTag
        );
        if (index === -1) return false;
        this._posts = [
            ...this._posts.slice(0, index),
            ...this._posts.slice(index + 1, this._posts.length),
        ];
        return true;
    }

    public async delete(id: PostId) {
        this._posts = this._posts.filter(x => x.id !== id);
    }

    public async getPostsByUser(user: UserTag): Promise<PostEntity[]> {
        return this._posts.filter(post => post.author.tag === user);
    }
}
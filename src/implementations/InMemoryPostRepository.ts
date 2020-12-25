import { PostEntity, PostId } from '../modules/posts/PostEntity';
import { IPostRepository } from '../modules/posts/IPostRepository';
import { PossiblyUnsaved } from '../utils';

const isPostSaved = (post: PossiblyUnsaved<PostEntity>): post is PostEntity =>
    post.hasOwnProperty('id');

export class InMemoryPostRepository implements IPostRepository {
    private _posts: PostEntity[] = [];

    public async findPostsByUsers(
        authorTags: string[],
        limit?: number
    ): Promise<PostEntity[]> {
        return this._posts
            .filter(x => authorTags.includes(x.authorTag))
            .sort(x => x.createdAt)
            .slice(0, limit || 100);
    }

    public async findOne(id: PostId): Promise<PostEntity | null> {
        return this._posts.find(post => post.id === id) || null;
    }

    public async save(post: PossiblyUnsaved<PostEntity>): Promise<PostEntity> {
        if (isPostSaved(post)) {
            this._posts = this._posts.map(x => (x.id === post.id ? post : x));
            return post;
        } else {
            const lastId =
                this._posts.length > 0
                    ? this._posts[this._posts.length - 1].id
                    : 0;
            const newPost = { id: lastId + 1, ...post };
            this._posts.push(newPost);
            return newPost;
        }
    }

    public async deleteIfAuthorTagIsCorrect(
        id: PostId,
        authorTag: string
    ): Promise<boolean> {
        const index = this._posts.findIndex(
            x => x.id === id && x.authorTag === authorTag
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

    public async getPostsByUser(user: string): Promise<PostEntity[]> {
        return this._posts.filter(post => post.authorTag === user);
    }
}

import { ILikeRepository } from '../modules/posts/ILikeRepository';

export class InMemoryLikeRepository implements ILikeRepository {
    private readonly _likes: Map<number, string[]> = new Map();

    public async createOrDeleteLike(
        postId: number,
        userTag: string
    ): Promise<number> {
        const likes = this._likes.get(postId);
        if (!likes) {
            this._likes.set(postId, [userTag]);
            return 1;
        } else {
            const otherLikes = likes.filter(x => x !== userTag);
            if (otherLikes.length === likes.length) {
                this._likes.set(postId, likes.concat(userTag));
                return otherLikes.length + 1;
            } else {
                // user already liked
                this._likes.set(postId, otherLikes);
                return otherLikes.length;
            }
        }
    }

    public async getLikesForPost(postId: number): Promise<number> {
        return this._likes.get(postId)?.length || 0;
    }

    public async getLikesForMultiplePosts(
        postIds: number[]
    ): Promise<number[]> {
        return postIds.map(id => this._likes.get(id)?.length || 0);
    }

    public async deleteLikesForPost(postId: number): Promise<void> {
        this._likes.delete(postId);
    }
}

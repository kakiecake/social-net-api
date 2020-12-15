import { ILikeRepository } from '../modules/posts/ILikeRepository';

export class InMemoryLikeRepository implements ILikeRepository {
    private readonly _postLikes: Map<number, string[]> = new Map();
    private readonly _commentLikes: Map<number, string[]> = new Map();

    public async likePost(postId: number, userTag: string): Promise<number> {
        const likes = this._postLikes.get(postId);
        if (!likes) {
            this._postLikes.set(postId, [userTag]);
            return 1;
        } else {
            const otherLikes = likes.filter(x => x !== userTag);
            if (otherLikes.length === likes.length) {
                this._postLikes.set(postId, likes.concat(userTag));
                return otherLikes.length + 1;
            } else {
                // user already liked
                this._postLikes.set(postId, otherLikes);
                return otherLikes.length;
            }
        }
    }

    public async likeComment(
        commentId: number,
        userTag: string
    ): Promise<number> {
        const likes = this._commentLikes.get(commentId);
        if (!likes) {
            this._commentLikes.set(commentId, [userTag]);
            return 1;
        } else {
            const otherLikes = likes.filter(x => x !== userTag);
            if (otherLikes.length === likes.length) {
                this._commentLikes.set(commentId, likes.concat(userTag));
                return otherLikes.length + 1;
            } else {
                // user already liked
                this._commentLikes.set(commentId, otherLikes);
                return otherLikes.length;
            }
        }
    }

    public async getLikesForPost(postId: number): Promise<number> {
        return this._postLikes.get(postId)?.length || 0;
    }

    public async getLikesForComment(commentId: number): Promise<number> {
        return this._postLikes.get(commentId)?.length || 0;
    }

    public async deleteLikesForPost(postId: number): Promise<void> {
        this._postLikes.delete(postId);
    }

    public async deleteLikesForComment(commentId: number): Promise<void> {
        this._commentLikes.delete(commentId);
    }
}

import { ILikeRepository } from '../modules/posts/ILikeRepository';
import { Connection, Repository } from 'typeorm';
import { LikeModel } from './LikeModel';

export class LikeRepository implements ILikeRepository {
    private readonly _likes: Repository<LikeModel>;

    constructor(connection: Connection) {
        this._likes = connection.getRepository(LikeModel);
    }

    public async likePost(postId: number, userTag: string): Promise<number> {
        return this._like(postId, userTag, 'post');
    }

    public async likeComment(
        commentId: number,
        userTag: string
    ): Promise<number> {
        return this._like(commentId, userTag, 'comment');
    }

    private async _like(
        postId: number,
        userTag: string,
        type: LikeModel['type']
    ): Promise<number> {
        const like = await this._likes.findOne({
            type,
            id: postId,
            userTag,
        });

        if (like) {
            await this._likes.delete(like);
        } else {
            await this._likes.save({ type, id: postId, userTag });
        }
        return this._likes.count({ type, id: postId });
    }

    public getLikesForPost(postId: number): Promise<number> {
        return this._likes.count({ type: 'post', id: postId });
    }

    public getLikesForComment(commentId: number): Promise<number> {
        return this._likes.count({ type: 'comment', id: commentId });
    }

    public async deleteLikesForPost(postId: number): Promise<void> {
        await this._likes.delete({ type: 'post', id: postId });
    }

    public async deleteLikesForComment(commentId: number): Promise<void> {
        await this._likes.delete({ type: 'comment', id: commentId });
    }
}

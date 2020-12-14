import { ILikeRepository } from '../modules/posts/ILikeRepository';
import { Connection, Repository } from 'typeorm';
import { LikeModel } from './LikeModel';

export class LikeRepository implements ILikeRepository {
    private readonly _likes: Repository<LikeModel>;

    constructor(connection: Connection) {
        this._likes = connection.getRepository(LikeModel);
    }

    public async createOrDeleteLike(
        postId: number,
        userTag: string
    ): Promise<number> {
        const like = await this._likes.findOne({ postId, userTag });
        if (like) {
            await this._likes.delete({ postId: like.postId });
        } else {
            await this._likes.save({ postId, userTag });
        }
        return this._likes.count({ postId });
    }

    public getLikesForPost(postId: number): Promise<number> {
        return this._likes.count({ postId });
    }

    public async getLikesForMultiplePosts(
        postIds: number[]
    ): Promise<number[]> {
        // in future this should perform 1 request
        return Promise.all(
            postIds.map(postId => this._likes.count({ postId }))
        );
    }

    public async deleteLikesForPost(postId: number): Promise<void> {
        await this._likes.delete({ postId });
    }
}

import { ICommentRepository } from '../modules/posts/ICommentRepository';
import { CommentEntity, CommentId } from '../modules/posts/CommentEntity';
import { PostId } from '../modules/posts/PostEntity';

export class InMemoryCommentRepository implements ICommentRepository {
    private _comments: Array<CommentEntity> = [];

    public async getCommentsForPost(postId: PostId): Promise<CommentEntity[]> {
        return this._comments.filter(x => x.postId === postId);
    }

    public async findOne(id: CommentId): Promise<CommentEntity | null> {
        return this._comments.find(x => x.id === id) || null;
    }

    public async save(comment: CommentEntity): Promise<CommentEntity> {
        if (comment.id !== null) {
            this._comments = this._comments.map(x =>
                x.id === comment.id
                    ? (comment as CommentEntity & { id: number })
                    : x
            );
        } else {
            const lastId =
                this._comments.length > 0
                    ? (this._comments[this._comments.length - 1]
                          .id as CommentId)
                    : 0;
            comment.setId(lastId + 1);
            this._comments.push(comment);
        }
        return comment;
    }

    public async deleteIfAuthorTagIsCorrect(
        id: CommentId,
        authorTag: string
    ): Promise<boolean> {
        const index = this._comments.findIndex(
            x => x.id === id && x.authorTag === authorTag
        );
        if (index === -1) return false;
        this._comments = [
            ...this._comments.slice(0, index),
            ...this._comments.slice(index + 1, this._comments.length),
        ];
        return true;
    }

    public async delete(id: PostId) {
        this._comments = this._comments.filter(x => x.id !== id);
    }
}

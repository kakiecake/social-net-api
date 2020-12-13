import { ICommentRepository } from '../modules/posts/ICommentRepository';
import { CommentModel } from './CommentModel';
import { CommentEntity } from '../modules/posts/CommentEntity';
import { Connection, Repository } from 'typeorm';
import { CommentFactory } from '../modules/posts/CommentFactory';
import { PossiblyUnsaved } from '../utils';

export class CommentRepository implements ICommentRepository {
    private readonly _comments: Repository<CommentModel>;

    constructor(
        private _commentFactory: CommentFactory,
        connection: Connection
    ) {
        this._comments = connection.getRepository(CommentModel);
    }

    public async findOne(id: number): Promise<CommentEntity | null> {
        const comment = await this._comments.findOne(id);
        console.log(comment);
        if (!comment) return null;
        return this._commentFactory.createCommentFromDTO(
            comment.id,
            comment.text,
            comment.authorTag,
            comment.postId,
            comment.createdAt
        );
    }

    public async getCommentsForPost(postId: number): Promise<CommentEntity[]> {
        const comments = await this._comments.find({ postId });
        return comments.map(comment =>
            this._commentFactory.createCommentFromDTO(
                comment.id,
                comment.text,
                comment.authorTag,
                comment.postId,
                comment.createdAt
            )
        );
    }

    public async save(comment: PossiblyUnsaved<CommentEntity>) {
        const savedComment = await this._comments.save(comment);
        return this._commentFactory.createCommentFromDTO(
            savedComment.id,
            savedComment.text,
            savedComment.authorTag,
            savedComment.postId,
            savedComment.createdAt
        );
    }

    public async deleteIfAuthorTagIsCorrect(
        id: number,
        authorTag: string
    ): Promise<boolean> {
        const result = await this._comments.delete({ id, authorTag });
        return Boolean(result.affected);
    }
}

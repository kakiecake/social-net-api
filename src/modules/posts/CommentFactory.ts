import { CommentEntity } from './CommentEntity';
import { CommentView } from './CommentView';

export class CommentFactory {
    public createComment(
        text: string,
        postId: number,
        authorTag: string
    ): CommentEntity {
        return new CommentEntity(
            undefined,
            text,
            authorTag,
            postId,
            Date.now()
        );
    }

    public convertCommentToDTO(comment: CommentEntity): CommentView {
        return {
            id: comment.id || null,
            text: comment.text,
            createdAt: comment.createdAt,
            authorTag: comment.authorTag,
        };
    }

    public createCommentFromDTO(
        id: number,
        text: string,
        authorTag: string,
        postId: number,
        createdAt: number
    ) {
        return new CommentEntity(id, text, authorTag, postId, createdAt);
    }
}

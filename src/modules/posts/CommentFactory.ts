import { CommentEntity } from './CommentEntity';
import { CommentView } from './CommentView';

export class CommentFactory {
    public createComment(
        text: string,
        postId: number,
        authorTag: string
    ): Omit<CommentEntity, 'id'> {
        return {
            text,
            authorTag,
            postId,
            createdAt: Date.now(),
        };
    }

    public convertCommentToDTO(comment: CommentEntity): CommentView {
        return {
            id: comment.id,
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
        return { id, text, authorTag, postId, createdAt };
    }
}

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

    public createCommentFromDTO(
        id: number,
        text: string,
        authorTag: string,
        postId: number,
        createdAt: number
    ): CommentEntity {
        return { id, text, authorTag, postId, createdAt };
    }
}

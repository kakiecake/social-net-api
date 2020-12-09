import { CommentEntity } from './CommentEntity';
import { PostId } from './PostEntity';
import { CommentView } from './CommentView';

export class CommentFactory {
    public createComment(
        text: string,
        postId: PostId,
        authorTag: string
    ): CommentEntity {
        return new CommentEntity(null, text, authorTag, postId, Date.now());
    }

    public convertCommentToDTO(comment: CommentEntity): CommentView {
        return {
            id: comment.id,
            text: comment.text,
            createdAt: comment.createdAt,
            authorTag: comment.authorTag,
        };
    }
}

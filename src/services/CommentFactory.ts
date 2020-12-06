import { CommentEntity } from '../entities/CommentEntity';
import { CommentView } from '../dto/CommentView';
import { UserTag } from '../entities/UserEntity';
import { PostId } from '../entities/PostEntity';

export class CommentFactory {
    public createComment(
        text: string,
        postId: PostId,
        authorTag: UserTag
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

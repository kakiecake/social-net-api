import { CommentId, CommentEntity } from '../entities/CommentEntity';
import { UserTag } from '../entities/UserEntity';
import { PostId } from '../entities/PostEntity';

export interface ICommentRepository {
    findOne(id: CommentId): Promise<CommentEntity | null>;
    getCommentsForPost(postId: PostId): Promise<Array<CommentEntity>>;
    save(comment: CommentEntity): Promise<CommentEntity>;
    deleteIfAuthorTagIsCorrect(
        id: CommentId,
        authorTag: UserTag
    ): Promise<boolean>;
}

import { CommentId, CommentEntity } from './CommentEntity';
import { PossiblyUnsaved } from '../../utils';

export interface ICommentRepository {
    findOne(id: CommentId): Promise<CommentEntity | null>;
    getCommentsForPost(postId: number): Promise<Array<CommentEntity>>;
    save(comment: PossiblyUnsaved<CommentEntity>): Promise<CommentEntity>;
    deleteIfAuthorTagIsCorrect(
        id: CommentId,
        authorTag: string
    ): Promise<boolean>;
}

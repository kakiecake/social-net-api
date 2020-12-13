import { PostEntity, PostId } from './PostEntity';
import { PossiblyUnsaved } from '../../utils';

export interface IPostRepository {
    getPostsByUser(userTag: string, limit?: number): Promise<PostEntity[]>;
    findOne(id: PostId): Promise<PostEntity | null>;
    save(post: PossiblyUnsaved<PostEntity>): Promise<PostEntity>;
    deleteIfAuthorTagIsCorrect(id: PostId, authorTag: string): Promise<boolean>;
}

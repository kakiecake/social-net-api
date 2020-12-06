import { PostEntity, PostId } from '../entities/PostEntity';
import { UserTag } from '../entities/UserEntity';

export interface IPostRepository {
    getPostsByUser(user: UserTag, limit?: number): Promise<PostEntity[]>;
    findOne(id: PostId): Promise<PostEntity | null>;
    save(post: PostEntity): Promise<PostEntity>;
    deleteIfAuthorTagIsCorrect(
        id: PostId,
        authorTag: UserTag
    ): Promise<boolean>;
}

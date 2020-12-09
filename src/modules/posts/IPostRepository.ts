import { PostEntity, PostId } from './PostEntity';

export interface IPostRepository {
    getPostsByUser(userTag: string, limit?: number): Promise<PostEntity[]>;
    findOne(id: PostId): Promise<PostEntity | null>;
    save(post: PostEntity): Promise<PostEntity>;
    deleteIfAuthorTagIsCorrect(id: PostId, authorTag: string): Promise<boolean>;
}

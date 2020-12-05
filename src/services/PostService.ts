import { PostEntity, PostId } from '../entities/PostEntity';
import { UserEntity } from '../entities/UserEntity';

export interface IPostRepository {
    findOne(id: PostId): Promise<PostEntity>;
    save(post: PostEntity): Promise<PostEntity>;
    delete(id: PostId): Promise<void>;
}

export class PostNotFoundError extends Error {}

export class PostService {
    constructor(private readonly _postRepository: IPostRepository) {}

    public async createPost(
        title: string,
        text: string,
        author: UserEntity
    ): Promise<PostEntity> {
        const post = new PostEntity(title, text, author);
        return this._postRepository.save(post);
    }

    public async editPost(
        id: PostId,
        title?: string,
        text?: string
    ): Promise<PostEntity | PostNotFoundError> {
        const post = await this._postRepository.findOne(id);
        if (post === null) return new PostNotFoundError();
        if (title) post.changeTitle(title);
        if (text) post.changeText(text);
        return this._postRepository.save(post);
    }

    public async deletePost(id: PostId): Promise<void> {
        return this._postRepository.delete(id);
    }
}

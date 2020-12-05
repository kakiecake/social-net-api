import { PostEntity, PostId } from '../entities/PostEntity';
import { UserEntity, UserTag } from '../entities/UserEntity';
import { PostFactory } from './PostFactory';

export interface IPostRepository {
    getPostsByUser(user: UserTag, limit?: number): Promise<PostEntity[]>;
    findOne(id: PostId): Promise<PostEntity>;
    save(post: PostEntity): Promise<PostEntity>;
    delete(id: PostId): Promise<void>;
}

export class PostNotFoundError extends Error {}

export class PostService {
    constructor(
        private readonly _postRepository: IPostRepository,
        private readonly _postFactory: PostFactory
    ) {}

    public getPostsForUser(
        userTag: UserTag,
        limit?: number
    ): Promise<PostEntity[]> {
        return this._postRepository.getPostsByUser(userTag, limit);
    }

    public async createPost(
        title: string,
        text: string,
        author: UserEntity
    ): Promise<PostEntity> {
        const post = this._postFactory.createNewPost(title, text, author);
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

import { PostEntity, PostId } from '../entities/PostEntity';
import { UserEntity, UserTag } from '../entities/UserEntity';
import { PostFactory } from './PostFactory';
import { PostView } from '../dto/PostView';

export interface IPostRepository {
    getPostsByUser(user: UserTag, limit?: number): Promise<PostEntity[]>;
    findOne(id: PostId): Promise<PostEntity | null>;
    save(post: PostEntity): Promise<PostEntity>;
    delete(id: PostId): Promise<void>;
}

export class PostNotFoundError extends Error {}

export class PostService {
    constructor(
        private readonly _postRepository: IPostRepository,
        private readonly _postFactory: PostFactory
    ) {}

    public async getPostsForUser(
        userTag: UserTag,
        limit?: number
    ): Promise<PostView[]> {
        const posts = await this._postRepository.getPostsByUser(userTag, limit);
        const postViews = posts.map(post =>
            this._postFactory.convertPostToDTO(post)
        );
        return postViews;
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

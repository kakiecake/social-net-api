import { IPostRepository } from '../modules/posts/IPostRepository';
import { PostEntity, PostId } from '../modules/posts/PostEntity';
import { Connection, Repository } from 'typeorm';
import { PostModel } from './PostModel';
import { PostFactory } from '../modules/posts/PostFactory';
import { PossiblyUnsaved } from '../utils';

export class PostRepository implements IPostRepository {
    private readonly _posts: Repository<PostModel>;

    constructor(
        private readonly _postFactory: PostFactory,
        _connection: Connection
    ) {
        this._posts = _connection.getRepository(PostModel);
    }

    public async findPostsByUsers(
        authorTags: string[],
        limit?: number
    ): Promise<PostEntity[]> {
        const posts = await this._posts
            .createQueryBuilder('post')
            .where('post.authorTag IN (:...authorTags)', { authorTags })
            .limit(limit || 100)
            .getMany();

        return posts.map(post => ({
            id: post.id,
            title: post.title,
            text: post.text,
            authorTag: post.authorTag,
            createdAt: post.createdAt,
        }));
    }

    public async getPostsByUser(userTag: string): Promise<PostEntity[]> {
        const posts = await this._posts.find({ authorTag: userTag });
        return posts.map(post =>
            this._postFactory.createPostFromDTO(
                post.id,
                post.title,
                post.text,
                post.authorTag,
                post.createdAt
            )
        );
    }

    public async findOne(id: PostId): Promise<PostEntity | null> {
        const post = await this._posts.findOne(id);
        if (!post) return null;
        else
            return this._postFactory.createPostFromDTO(
                post.id,
                post.title,
                post.text,
                post.authorTag,
                post.createdAt
            );
    }

    public async save(post: PossiblyUnsaved<PostEntity>): Promise<PostEntity> {
        const savedPost: PostModel = await this._posts.save(post);
        return this._postFactory.createPostFromDTO(
            savedPost.id,
            savedPost.title,
            savedPost.text,
            savedPost.authorTag,
            savedPost.createdAt
        );
    }

    public async deleteIfAuthorTagIsCorrect(
        id: number,
        authorTag: string
    ): Promise<boolean> {
        const result = await this._posts.delete({ id, authorTag });
        return Boolean(result.affected);
    }
}

import { PostId, PostEntity } from '../entities/PostEntity';
import { UserEntity } from '../entities/UserEntity';
import { PostView } from '../dto/PostView';

export class PostFactory {
    public createPostFromDTO(
        id: PostId,
        title: string,
        text: string,
        author: UserEntity,
        createdAt: number
    ): PostEntity {
        return new PostEntity(id, title, text, author, createdAt);
    }

    public createNewPost(
        title: string,
        text: string,
        author: UserEntity
    ): PostEntity {
        return new PostEntity(null, title, text, author, Date.now());
    }

    public convertPostToDTO(post: PostEntity): PostView {
        return {
            id: post.id as PostId,
            title: post.title,
            text: post.text,
            authorTag: post.author.tag,
            createdAt: post.createdAt,
        };
    }
}

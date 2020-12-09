import { PostId, PostEntity } from './PostEntity';
import { PostView } from './PostView';

export class PostFactory {
    public createPostFromDTO(
        id: PostId,
        title: string,
        text: string,
        authorTag: string,
        createdAt: number
    ): PostEntity {
        return new PostEntity(id, title, text, authorTag, createdAt);
    }

    public createNewPost(
        title: string,
        text: string,
        authorTag: string
    ): PostEntity {
        return new PostEntity(null, title, text, authorTag, Date.now());
    }

    public convertPostToDTO(post: PostEntity): PostView {
        return {
            id: post.id as PostId,
            title: post.title,
            text: post.text,
            authorTag: post.authorTag,
            createdAt: post.createdAt,
        };
    }
}

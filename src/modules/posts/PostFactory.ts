import { PostId, PostEntity } from './PostEntity';

export class PostFactory {
    public createPostFromDTO(
        id: PostId,
        title: string,
        text: string,
        authorTag: string,
        createdAt: number
    ): PostEntity {
        return { id, title, text, authorTag, createdAt };
    }

    public createNewPost(
        title: string,
        text: string,
        authorTag: string
    ): Omit<PostEntity, 'id'> {
        return { title, text, authorTag, createdAt: Date.now() };
    }
}

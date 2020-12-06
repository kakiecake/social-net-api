import { UserTag } from '../entities/UserEntity';
import { PostId } from '../entities/PostEntity';

export type PostView = {
    id: PostId;
    title: string;
    text: string;
    authorTag: UserTag;
    createdAt: number;
};

import { PostId } from './PostEntity';

export type PostView = {
    id: PostId;
    title: string;
    text: string;
    authorTag: string;
    createdAt: number;
};

export type PostId = number;

export type PostEntity = {
    readonly id: PostId;
    title: string;
    text: string;
    authorTag: string;
    readonly createdAt: number;
};

export type CommentId = number;

export type CommentEntity = {
    readonly id: number;
    text: string;
    authorTag: string;
    postId: number;
    readonly createdAt: number;
};

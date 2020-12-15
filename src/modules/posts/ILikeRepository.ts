export interface ILikeRepository {
    likePost(postId: number, userTag: string): Promise<number>;
    likeComment(commentId: number, userTag: string): Promise<number>;

    getLikesForPost(postId: number): Promise<number>;
    getLikesForComment(commentId: number): Promise<number>;

    deleteLikesForComment(commentId: number): Promise<void>;
    deleteLikesForPost(postId: number): Promise<void>;
}

export interface ILikeRepository {
    createOrDeleteLike(postId: number, userTag: string): Promise<number>;
    getLikesForPost(postId: number): Promise<number>;

    // Used to avoid N + 1 problem
    // In future may be swapped with datareader or analogs
    getLikesForMultiplePosts(postIds: number[]): Promise<number[]>;

    deleteLikesForPost(postId: number): Promise<void>;
}

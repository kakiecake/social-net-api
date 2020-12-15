import { PostService } from './PostService';
import { PostId } from './PostEntity';
import { CommentId } from './CommentEntity';

export class PostFacade {
    constructor(private readonly _postService: PostService) {}

    getPostById(postId: PostId) {
        return this._postService.getPostById(postId);
    }

    getPostWithComments(postId: PostId) {
        return this._postService.getPostWithComments(postId);
    }

    getPostsByUser(userTag: string, limit?: number) {
        return this._postService.getPostsByUser(userTag, limit);
    }

    createPost(title: string, text: string, authorTag: string) {
        return this._postService.createPost(title, text, authorTag);
    }

    editPost(
        id: PostId,
        title: string | undefined,
        text: string | undefined,
        authorTag: string
    ) {
        return this._postService.editPost(id, title, text, authorTag);
    }

    deletePost(id: PostId, authorTag: string) {
        return this._postService.deletePost(id, authorTag);
    }

    leaveComment(text: string, postId: PostId, userTag: string) {
        return this._postService.leaveComment(text, postId, userTag);
    }

    getCommentsForPost(postId: PostId) {
        return this._postService.getCommentsForPost(postId);
    }

    editComment(text: string, commentId: CommentId, authorTag: string) {
        return this._postService.editComment(text, commentId, authorTag);
    }

    deleteComment(commentId: CommentId, authorTag: string) {
        return this._postService.deleteComment(commentId, authorTag);
    }

    likePost(postId: PostId, userTag: string) {
        return this._postService.likePost(postId, userTag);
    }

    likeComment(commentId: CommentId, userTag: string) {
        return this._postService.likeComment(commentId, userTag);
    }
}

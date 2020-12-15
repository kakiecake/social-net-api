import { PostId } from './PostEntity';
import { PostFactory } from './PostFactory';
import { PostView } from './PostView';
import { PostDetailView } from './PostDetailView';
import { IPostRepository } from './IPostRepository';
import { ICommentRepository } from './ICommentRepository';
import { CommentFactory } from './CommentFactory';
import { CommentId } from './CommentEntity';
import { CommentView } from './CommentView';
import {
    CommentNotFoundError,
    PostNotFoundError,
    NotAllowedError,
} from './errors';
import { ILikeRepository } from './ILikeRepository';

export class PostService {
    constructor(
        private readonly _postRepository: IPostRepository,
        private readonly _postFactory: PostFactory,
        private readonly _commentRepository: ICommentRepository,
        private readonly _commentFactory: CommentFactory,
        private readonly _likeRepository: ILikeRepository
    ) {}

    public async getPostById(postId: PostId): Promise<PostView | null> {
        const post = await this._postRepository.findOne(postId);
        if (post === null) return null;
        const likes = await this._likeRepository.getLikesForPost(postId);
        return { ...post, likes };
    }

    public async getPostWithComments(
        postId: PostId
    ): Promise<PostDetailView | null> {
        const post = await this._postRepository.findOne(postId);
        if (post === null) return null;
        const [likes, comments] = await Promise.all([
            this._likeRepository.getLikesForPost(postId),
            this._commentRepository.getCommentsForPost(postId),
        ]);
        const commentLikes = await Promise.all(
            comments.map(comment =>
                this._likeRepository.getLikesForComment(comment.id)
            )
        );
        const commentsWithLikes: CommentView[] = comments.map(
            (comment, index) => ({
                id: comment.id,
                text: comment.text,
                createdAt: comment.createdAt,
                authorTag: comment.authorTag,
                likes: commentLikes[index],
            })
        );
        return { ...post, likes, comments: commentsWithLikes };
    }

    public async getPostsByUser(
        userTag: string,
        limit?: number
    ): Promise<PostView[]> {
        const posts = await this._postRepository.getPostsByUser(userTag, limit);
        const likes = await Promise.all(
            posts.map(post => this._likeRepository.getLikesForPost(post.id))
        );
        return posts.map((post, index) => ({ ...post, likes: likes[index] }));
    }

    public async createPost(
        title: string,
        text: string,
        authorTag: string
    ): Promise<PostView> {
        const newPost = this._postFactory.createNewPost(title, text, authorTag);
        const savedPost = await this._postRepository.save(newPost);
        return { ...savedPost, likes: 0 };
    }

    public async editPost(
        id: PostId,
        title: string | undefined,
        text: string | undefined,
        authorTag: string
    ): Promise<void | PostNotFoundError | NotAllowedError> {
        const post = await this._postRepository.findOne(id);
        if (post === null) return new PostNotFoundError();
        if (post.authorTag !== authorTag) return new NotAllowedError();
        if (title) post.title = title;
        if (text) post.text = text;
        await this._postRepository.save(post);
    }

    public async deletePost(
        id: PostId,
        authorTag: string
    ): Promise<NotAllowedError | null> {
        const isDeleted = await this._postRepository.deleteIfAuthorTagIsCorrect(
            id,
            authorTag
        );

        if (!isDeleted) {
            return new NotAllowedError();
        } else {
            await this._likeRepository.deleteLikesForPost(id);
            return null;
        }
    }

    public async leaveComment(
        text: string,
        postId: PostId,
        userTag: string
    ): Promise<CommentView | PostNotFoundError> {
        if ((await this._postRepository.findOne(postId)) === null)
            return new PostNotFoundError();
        const comment = this._commentFactory.createComment(
            text,
            postId,
            userTag
        );
        const savedComment = await this._commentRepository.save(comment);
        return {
            id: savedComment.id,
            text: savedComment.text,
            authorTag: savedComment.authorTag,
            createdAt: savedComment.createdAt,
            likes: 0,
        };
    }

    public async getCommentsForPost(postId: PostId): Promise<CommentView[]> {
        const comments = await this._commentRepository.getCommentsForPost(
            postId
        );
        const likes = await Promise.all(
            comments.map(comment =>
                this._likeRepository.getLikesForComment(comment.id)
            )
        );
        return comments.map((comment, index) => ({
            id: comment.id,
            text: comment.text,
            authorTag: comment.authorTag,
            createdAt: comment.createdAt,
            likes: likes[index],
        }));
    }

    public async editComment(
        text: string,
        commentId: CommentId,
        authorTag: string
    ): Promise<CommentNotFoundError | NotAllowedError | null> {
        const comment = await this._commentRepository.findOne(commentId);
        if (comment === null) return new CommentNotFoundError();
        if (comment.authorTag !== authorTag) return new NotAllowedError();
        comment.text = text;
        await this._commentRepository.save(comment);
        return null;
    }

    public async deleteComment(
        commentId: CommentId,
        authorTag: string
    ): Promise<NotAllowedError | null> {
        const isDeleted = await this._commentRepository.deleteIfAuthorTagIsCorrect(
            commentId,
            authorTag
        );

        if (!isDeleted) {
            return new NotAllowedError();
        } else {
            return null;
        }
    }

    public async likePost(postId: number, userTag: string): Promise<number> {
        return this._likeRepository.likePost(postId, userTag);
    }

    public async likeComment(
        commentId: number,
        userTag: string
    ): Promise<number> {
        return this._likeRepository.likeComment(commentId, userTag);
    }
}

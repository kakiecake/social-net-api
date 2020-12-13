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

export class PostService {
    constructor(
        private readonly _postRepository: IPostRepository,
        private readonly _postFactory: PostFactory,
        private readonly _commentRepository: ICommentRepository,
        private readonly _commentFactory: CommentFactory
    ) {}

    public async getPostById(postId: PostId): Promise<PostView | null> {
        const post = await this._postRepository.findOne(postId);
        if (post === null) return null;
        return this._postFactory.convertPostToDTO(post);
    }

    public async getPostWithComments(
        postId: PostId
    ): Promise<PostDetailView | null> {
        const post = await this._postRepository.findOne(postId);
        if (post === null) return null;
        const comments = await this._commentRepository.getCommentsForPost(
            postId
        );
        const postDTO = this._postFactory.convertPostToDTO(post);
        const commentDTOs = comments.map(x =>
            this._commentFactory.convertCommentToDTO(x)
        );
        return { ...postDTO, comments: commentDTOs };
    }

    public async getPostsByUser(
        userTag: string,
        limit?: number
    ): Promise<PostView[]> {
        const posts = await this._postRepository.getPostsByUser(userTag, limit);
        const postViews = posts.map(post =>
            this._postFactory.convertPostToDTO(post)
        );
        return postViews;
    }

    public async createPost(
        title: string,
        text: string,
        authorTag: string
    ): Promise<PostView> {
        const newPost = this._postFactory.createNewPost(title, text, authorTag);
        const savedPost = await this._postRepository.save(newPost);
        const postView = this._postFactory.convertPostToDTO(savedPost);
        return postView;
    }

    public async editPost(
        id: PostId,
        title: string | undefined,
        text: string | undefined,
        authorTag: string
    ): Promise<PostView | PostNotFoundError | NotAllowedError> {
        const post = await this._postRepository.findOne(id);
        if (post === null) return new PostNotFoundError();
        if (post.authorTag !== authorTag) return new NotAllowedError();
        if (title) post.changeTitle(title);
        if (text) post.changeText(text);
        const savedPost = await this._postRepository.save(post);
        return this._postFactory.convertPostToDTO(savedPost);
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
            return null;
        }
    }

    public async leaveComment(
        text: string,
        postId: PostId,
        userTag: string
    ): Promise<CommentView | PostNotFoundError> {
        if (this._postRepository.findOne(postId) === null)
            return new PostNotFoundError();
        const comment = this._commentFactory.createComment(
            text,
            postId,
            userTag
        );
        const savedComment = await this._commentRepository.save(comment);
        return this._commentFactory.convertCommentToDTO(savedComment);
    }

    public async getCommentsForPost(postId: PostId): Promise<CommentView[]> {
        const comments = await this._commentRepository.getCommentsForPost(
            postId
        );
        return comments.map(comment =>
            this._commentFactory.convertCommentToDTO(comment)
        );
    }

    public async editComment(
        text: string,
        commentId: CommentId,
        authorTag: string
    ): Promise<CommentNotFoundError | NotAllowedError | null> {
        const comment = await this._commentRepository.findOne(commentId);
        if (comment === null) return new CommentNotFoundError();
        if (comment.authorTag !== authorTag) return new NotAllowedError();
        comment.changeText(text);
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
}

import { PostEntity, PostId } from '../entities/PostEntity';
import { UserTag, UserEntity } from '../entities/UserEntity';
import { PostFactory } from './PostFactory';
import { PostView } from '../dto/PostView';
import { PostDetailView } from '../dto/PostDetailView';
import { IPostRepository } from './IPostRepository';
import { ICommentRepository } from './ICommentRepository';
import { CommentFactory } from './CommentFactory';
import { CommentId } from '../entities/CommentEntity';
import { CommentView } from '../dto/CommentView';

export class CommentNotFoundError extends Error {}
export class PostNotFoundError extends Error {}
export class NotAllowedError extends Error {}

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

    public async getPostsForUser(
        userTag: UserTag,
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
        author: UserEntity
    ): Promise<PostView> {
        const newPost = this._postFactory.createNewPost(title, text, author);
        const savedPost = await this._postRepository.save(newPost);
        const postView = this._postFactory.convertPostToDTO(savedPost);
        return postView;
    }

    public async editPost(
        id: PostId,
        title: string | undefined,
        text: string | undefined,
        author: UserEntity
    ): Promise<PostEntity | PostNotFoundError | NotAllowedError> {
        const post = await this._postRepository.findOne(id);
        if (post === null) return new PostNotFoundError();
        if (post.author.tag !== author.tag) return new NotAllowedError();
        if (title) post.changeTitle(title);
        if (text) post.changeText(text);
        return this._postRepository.save(post);
    }

    public async deletePost(
        id: PostId,
        author: UserEntity
    ): Promise<NotAllowedError | null> {
        const isDeleted = await this._postRepository.deleteIfAuthorTagIsCorrect(
            id,
            author.tag
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
        userTag: UserTag
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

    public async getCommentsForPost(post: PostEntity): Promise<CommentView[]> {
        if (post.id === null) return [];
        const comments = await this._commentRepository.getCommentsForPost(
            post.id
        );
        return comments.map(comment =>
            this._commentFactory.convertCommentToDTO(comment)
        );
    }

    public async editComment(
        text: string,
        commentId: CommentId,
        author: UserEntity
    ): Promise<CommentNotFoundError | NotAllowedError | null> {
        const comment = await this._commentRepository.findOne(commentId);
        if (comment === null) return new CommentNotFoundError();
        if (comment.authorTag !== author.tag) return new NotAllowedError();
        comment.changeText(text);
        await this._commentRepository.save(comment);
        return null;
    }

    public async deleteComment(
        commentId: CommentId,
        author: UserEntity
    ): Promise<NotAllowedError | null> {
        const isDeleted = await this._commentRepository.deleteIfAuthorTagIsCorrect(
            commentId,
            author.tag
        );
        if (!isDeleted) {
            return new NotAllowedError();
        } else {
            return null;
        }
    }
}

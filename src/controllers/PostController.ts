import {
    Controller,
    Get,
    UseGuards,
    Post,
    Body,
    Delete,
    Param,
    UseInterceptors,
    Put,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { AuthGuard, User } from './AuthGuard';
import { PostFacade } from '../modules/posts/PostFacade';
import { PostView } from '../modules/posts/PostView';
import { PostDetailView } from '../modules/posts/PostDetailView';
import { HttpResponseInterceptor } from './HTTPResponseInterceptor';
import { NotAllowedError, PostNotFoundError } from '../modules/posts/errors';
import { UserTagParams } from './dto/UserTagParams';
import { CreatePostDTO } from './dto/CreatePostDTO';
import { EditPostDTO } from './dto/EditPostDTO';
import { CreateCommentDTO } from './dto/CreateCommentDTO';
import { CommentView } from '../modules/posts/CommentView';

@UseInterceptors(HttpResponseInterceptor)
@Controller('/posts')
export class PostController {
    constructor(private readonly _postFacade: PostFacade) {}

    @Get('/:postId')
    public async getPostWithComments(
        @Param('postId') postId: number
    ): Promise<PostDetailView | NotFoundException> {
        const post = await this._postFacade.getPostWithComments(postId);
        if (!post) return new NotFoundException('Post not found');
        else return post;
    }

    @Get('/byUser/:userTag')
    public async getPostsByUser(
        @Param() params: UserTagParams
    ): Promise<PostView[]> {
        return this._postFacade.getPostsByUser(params.userTag);
    }

    @UseGuards(AuthGuard)
    @Post('/')
    public async createPost(
        @Body() body: CreatePostDTO,
        @User() userTag: string
    ): Promise<PostView> {
        return this._postFacade.createPost(body.title, body.text, userTag);
    }

    @UseGuards(AuthGuard)
    @Put('/:postId')
    public async editPost(
        @Param('postId') postId: number,
        @Body() body: EditPostDTO,
        @User() userTag: string
    ): Promise<ForbiddenException | NotFoundException | void> {
        const post = await this._postFacade.editPost(
            postId,
            body.title,
            body.text,
            userTag
        );
        if (post instanceof NotAllowedError) return new ForbiddenException();
        if (post instanceof PostNotFoundError)
            return new NotFoundException('Post not found');
    }

    @UseGuards(AuthGuard)
    @Delete('/:postId')
    public async deletePost(
        @Param('postId') postId: number,
        @User() userTag: string
    ): Promise<ForbiddenException | void> {
        const err = await this._postFacade.deletePost(postId, userTag);
        if (err) return new ForbiddenException();
    }

    @UseGuards(AuthGuard)
    @Post('/:postId/like')
    public async likePost(
        @Param('postId') postId: number,
        @User() user: string
    ): Promise<number> {
        return this._postFacade.likePost(postId, user);
    }

    @UseGuards(AuthGuard)
    @Post('/:postId/comment')
    public async commentPost(
        @Body() body: CreateCommentDTO,
        @Param('postId') postId: number,
        @User() userTag: string
    ): Promise<CommentView | NotFoundException> {
        const comment = await this._postFacade.leaveComment(
            body.text,
            postId,
            userTag
        );
        if (comment instanceof PostNotFoundError)
            return new NotFoundException('Post not found');
        else return comment;
    }
}

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
} from '@nestjs/common';
import { AuthGuard, User } from './AuthGuard';
import { PostFacade } from '../modules/posts/PostFacade';
import { PostView } from '../modules/posts/PostView';
import { PostDetailView } from '../modules/posts/PostDetailView';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { ControllerResponse } from './ApiResponse';
import { NotAllowedError, PostNotFoundError } from '../modules/posts/errors';
import { PostIdParams } from './dto/PostIdParams';
import { UserTagParams } from './dto/UserTagParams';
import { CreatePostDTO } from './dto/CreatePostDTO';
import { EditPostDTO } from './dto/EditPostDTO';
import { CreateCommentDTO } from './dto/CreateCommentDTO';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/posts')
export class PostController {
    constructor(private readonly _postFacade: PostFacade) {}

    @Get('/:postId')
    public async getPostWithComments(
        @Param() params: PostIdParams
    ): Promise<ControllerResponse<PostDetailView>> {
        const post = await this._postFacade.getPostWithComments(params.postId);
        if (!post) return [404, 'Post not found'];
        else return [200, post];
    }

    @Get('/byUser/:userTag')
    public async getPostsByUser(
        @Param() params: UserTagParams
    ): Promise<ControllerResponse<PostView[]>> {
        const posts = await this._postFacade.getPostsByUser(params.userTag);
        return [200, posts];
    }

    @UseGuards(AuthGuard)
    @Post('/')
    public async createPost(
        @Body() body: CreatePostDTO,
        @User() userTag: string
    ): Promise<ControllerResponse<PostView>> {
        const post = await this._postFacade.createPost(
            body.title,
            body.text,
            userTag
        );
        return [200, post];
    }

    @UseGuards(AuthGuard)
    @Put('/')
    public async editPost(@Body() body: EditPostDTO, @User() userTag: string) {
        const post = await this._postFacade.editPost(
            body.id,
            body.title,
            body.text,
            userTag
        );
        if (post instanceof NotAllowedError) return [403, 'Forbidden'];
        if (post instanceof PostNotFoundError) return [404, 'Post not found'];
        return [200, null];
    }

    @UseGuards(AuthGuard)
    @Delete('/:postId')
    public async deletePost(
        @Param() params: PostIdParams,
        @User() userTag: string
    ) {
        const err = await this._postFacade.deletePost(params.postId, userTag);
        if (err) return [403, 'Forbidden'];
        else return [200, null];
    }

    @UseGuards(AuthGuard)
    @Post('/:postId/like')
    public async likePost(@Param() params: PostIdParams, @User() user: string) {
        const likes = await this._postFacade.likePost(params.postId, user);
        return [200, likes];
    }

    @UseGuards(AuthGuard)
    @Post('/:postId/comment')
    public async commentPost(
        @Body() body: CreateCommentDTO,
        @Param() params: PostIdParams,
        @User() userTag: string
    ) {
        const comment = await this._postFacade.leaveComment(
            body.text,
            params.postId,
            userTag
        );
        if (comment instanceof PostNotFoundError)
            return [404, 'Post not found'];
        else return [200, comment];
    }
}

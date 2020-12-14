import {
    Controller,
    Get,
    UseGuards,
    Post,
    Body,
    Delete,
    Param,
    Patch,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard, User } from './AuthGuard';
import { PostFacade } from '../modules/posts/PostFacade';
import { PostView } from '../modules/posts/PostView';
import { PostDetailView } from '../modules/posts/PostDetailView';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { ControllerResponse } from './ApiResponse';
import { NotAllowedError, PostNotFoundError } from '../modules/posts/errors';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/posts')
export class PostController {
    constructor(private readonly _postFacade: PostFacade) {}

    @Get('/:id')
    public async getPostWithComments(
        @Param('id') idParam: string
    ): Promise<ControllerResponse<PostDetailView>> {
        let id = Number(idParam);
        if (isNaN(id)) return [400, 'Invalid ID parameter'];

        const post = await this._postFacade.getPostWithComments(id);
        if (!post) return [404, 'Post not found'];
        else return [200, post];
    }

    @UseGuards(AuthGuard)
    @Get('/')
    public async getPosts(
        @User() user: string
    ): Promise<ControllerResponse<PostView[]>> {
        const posts = await this._postFacade.getPostsByUser(user);
        return [200, posts];
    }

    @UseGuards(AuthGuard)
    @Post('/')
    public async createPost(
        @Body('title') title: string,
        @Body('text') text: string,
        @User() user: string
    ): Promise<ControllerResponse<PostView>> {
        const post = await this._postFacade.createPost(title, text, user);
        return [200, post];
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    public async editPost(
        @User() user: string,
        @Body('id') idParam: string,
        @Body('title') title?: string,
        @Body('text') text?: string
    ) {
        const id = Number(idParam);
        if (isNaN(id)) return [400, 'Invalid ID parameter'];
        if (!title && !text) return [400, 'Title or text must be provided'];

        const post = await this._postFacade.editPost(id, title, text, user);
        if (post instanceof NotAllowedError) return [403, 'Forbidden'];
        if (post instanceof PostNotFoundError) return [404, 'Post not found'];
        return [200, null];
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    public async deletePost(
        @Param('id') idParam: string,
        @User() user: string
    ) {
        let id = Number(idParam);
        if (isNaN(id)) return [400, 'Invalid ID parameter'];
        const err = await this._postFacade.deletePost(id, user);
        if (err) return [403, 'Forbidden'];
        else return [200, null];
    }

    @UseGuards(AuthGuard)
    @Post('/like')
    public async likePost(
        @Body('postId') postIdParam: string,
        @User() user: string
    ) {
        const postId = Number(postIdParam);
        if (isNaN(postId)) return [400, 'Invalid postId parameter'];
        const likes = await this._postFacade.likePost(postId, user);
        return [200, likes];
    }
}

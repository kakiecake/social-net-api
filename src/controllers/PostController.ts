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
import { AuthGuard, User } from './authUtils';
import { UserEntity } from '../entities/UserEntity';
import {
    PostService,
    NotAllowedError,
    PostNotFoundError,
} from '../services/PostService';
import { ControllerResponse } from './ApiResponse';
import { PostView } from '../dto/PostView';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { PostDetailView } from '../dto/PostDetailView';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/posts')
export class PostController {
    constructor(private readonly _postService: PostService) {}

    @Get('/:id')
    public async getPostWithComments(
        @Param('id') idParam: string
    ): Promise<ControllerResponse<PostDetailView>> {
        let id = Number(idParam);
        if (isNaN(id)) return [400, 'Invalid ID parameter'];

        const post = await this._postService.getPostWithComments(id);
        if (!post) return [404, 'Post not found'];
        else return [200, post];
    }

    @UseGuards(AuthGuard)
    @Get('/')
    public async getPosts(
        @User() user: UserEntity
    ): Promise<ControllerResponse<PostView[]>> {
        const posts = await this._postService.getPostsForUser(user.tag);
        return [200, posts];
    }

    @UseGuards(AuthGuard)
    @Post('/')
    public async createPost(
        @Body('title') title: string,
        @Body('text') text: string,
        @User() user: UserEntity
    ): Promise<ControllerResponse<PostView>> {
        const post = await this._postService.createPost(title, text, user);
        return [200, post];
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    public async editPost(
        @User() user: UserEntity,
        @Body('id') idParam: string,
        @Body('title') title?: string,
        @Body('text') text?: string
    ) {
        const id = Number(idParam);
        if (isNaN(id)) return [400, 'Invalid ID parameter'];
        if (!title && !text) return [400, 'Title or text must be provided'];

        const post = await this._postService.editPost(id, title, text, user);
        if (post instanceof NotAllowedError) return [403, 'Forbidden'];
        if (post instanceof PostNotFoundError) return [404, 'Post not found'];
        return [200, null];
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    public async deletePost(
        @Param('id') idParam: string,
        @User() user: UserEntity
    ) {
        let id = Number(idParam);
        if (isNaN(id)) return [400, 'Invalid ID parameter'];
        const err = await this._postService.deletePost(id, user);
        if (err) return [403, 'Forbidden'];
        else return [200, null];
    }
}

import {
    Controller,
    Get,
    UseGuards,
    Post,
    Body,
    Delete,
    Param,
    Patch,
    Res,
} from '@nestjs/common';
import { AuthGuard, User } from './authUtils';
import { UserEntity } from '../entities/UserEntity';
import {
    PostService,
    NotAllowedError,
    PostNotFoundError,
} from '../services/PostService';
import { ApiResponse } from './ApiResponse';
import { PostView } from '../dto/PostView';
import { PostId } from '../entities/PostEntity';
import { Response } from 'express';

@Controller('/posts')
export class PostController {
    constructor(private readonly _postService: PostService) {}

    @UseGuards(AuthGuard)
    @Get('/')
    public async getPosts(
        @User() user: UserEntity
    ): Promise<ApiResponse<PostView[]>> {
        const posts = await this._postService.getPostsForUser(user.tag);
        return { success: true, data: posts };
    }

    @UseGuards(AuthGuard)
    @Post('/')
    public async createPost(
        @Body('title') title: string,
        @Body('text') text: string,
        @User() user: UserEntity
    ): Promise<ApiResponse<PostView>> {
        const post = await this._postService.createPost(title, text, user);
        return { success: true, data: post };
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    public async editPost(
        @User() user: UserEntity,
        @Res() res: Response,
        @Body('id') idParam: string,
        @Body('title') title?: string,
        @Body('text') text?: string
    ) {
        const id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid ID parameter',
                data: null,
            });
            return;
        }

        if (!title && !text) {
            res.status(400).json({
                success: false,
                error: 'Title or text must be provided',
                data: null,
            });
            return;
        }

        const post = await this._postService.editPost(id, title, text, user);
        if (post instanceof NotAllowedError) {
            res.status(403).json({
                success: false,
                error: 'Not allowed',
                data: null,
            });
        } else if (post instanceof PostNotFoundError) {
            res.status(404).json({
                success: false,
                error: 'Post not found',
                data: null,
            });
        } else {
            res.status(200).json({
                success: true,
                data: null,
            });
        }
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    public async deletePost(
        @Param('id') idParam: string,
        @Res() res: Response
    ) {
        let id = Number(idParam);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid ID parameter',
                data: null,
            });
        } else {
            await this._postService.deletePost(id);
            res.status(200).json({ success: true, data: null });
        }
    }
}

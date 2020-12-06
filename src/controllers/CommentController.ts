import {
    Controller,
    Post,
    Body,
    UseGuards,
    Res,
    Delete,
    Patch,
} from '@nestjs/common';
import { UserEntity } from '../entities/UserEntity';
import { User, AuthGuard } from './authUtils';
import {
    PostService,
    PostNotFoundError,
    NotAllowedError,
    CommentNotFoundError,
} from '../services/PostService';
import { Response } from 'express';

@Controller('/comments')
export class CommentController {
    constructor(private readonly _postService: PostService) {}

    @UseGuards(AuthGuard)
    @Post('/')
    public async createComment(
        @Body('text') text: string,
        @Body('postId') postIdParam: string,
        @User() user: UserEntity,
        @Res() res: Response
    ) {
        const postId = Number(postIdParam);
        if (isNaN(postId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid postId parameter',
                data: null,
            });
            return;
        }

        const comment = await this._postService.leaveComment(
            text,
            postId,
            user.tag
        );

        if (comment instanceof PostNotFoundError) {
            res.status(404).json({
                success: false,
                error: 'Post not found',
                data: null,
            });
            return;
        } else {
            res.status(200).json({
                success: true,
                data: comment,
            });
        }
    }

    @UseGuards(AuthGuard)
    @Delete('/')
    public async deleteComment(
        @Body('id') commentIdParam: string,
        @User() user: UserEntity,
        @Res() res: Response
    ) {
        const commentId = Number(commentIdParam);
        if (isNaN(commentId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid commentId parameter',
                data: null,
            });
            return;
        }

        if (this._postService.deleteComment(commentId, user) === null) {
            res.status(200).json({ success: true, data: null });
        } else {
            res.status(403).json({
                success: false,
                error: 'Not allowed',
                data: null,
            });
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    public async editComment(
        @Body('commentId') commentIdParam: string,
        @Body('text') text: string,
        @User() user: UserEntity,
        @Res() res: Response
    ) {
        const commentId = Number(commentIdParam);
        if (isNaN(commentId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid commentId parameter',
                data: null,
            });
            return;
        }

        const err = this._postService.editComment(text, commentId, user);
        if (err instanceof NotAllowedError) {
            res.status(403).json({
                success: false,
                error: 'Foridden',
                data: null,
            });
        } else if (err instanceof CommentNotFoundError) {
            res.status(404).json({
                success: false,
                error: 'Comment not found',
                data: null,
            });
            return;
        } else {
            res.status(200).json({
                success: true,
                data: null,
            });
        }
    }
}

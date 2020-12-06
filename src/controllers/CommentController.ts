import {
    Controller,
    Post,
    Body,
    UseGuards,
    Delete,
    Patch,
    UseInterceptors,
} from '@nestjs/common';
import { UserEntity } from '../entities/UserEntity';
import { User, AuthGuard } from './authUtils';
import {
    PostService,
    PostNotFoundError,
    NotAllowedError,
    CommentNotFoundError,
} from '../services/PostService';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/comments')
export class CommentController {
    constructor(private readonly _postService: PostService) {}

    @UseGuards(AuthGuard)
    @Post('/')
    public async createComment(
        @Body('text') text: string,
        @Body('postId') postIdParam: string,
        @User() user: UserEntity
    ) {
        const postId = Number(postIdParam);
        if (isNaN(postId)) return [400, 'Invalid postId parameter'];

        const comment = await this._postService.leaveComment(
            text,
            postId,
            user.tag
        );

        if (comment instanceof PostNotFoundError)
            return [404, 'Post not found'];
        else return [200, comment];
    }

    @UseGuards(AuthGuard)
    @Delete('/')
    public async deleteComment(
        @Body('commentId') commentIdParam: string,
        @User() user: UserEntity
    ) {
        const commentId = Number(commentIdParam);
        if (isNaN(commentId)) return [400, 'Invalid commentId parameter'];

        if ((await this._postService.deleteComment(commentId, user)) === null)
            return [200, null];
        else return [403, 'Forbidden'];
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    public async editComment(
        @Body('commentId') commentIdParam: string,
        @Body('text') text: string,
        @User() user: UserEntity
    ) {
        const commentId = Number(commentIdParam);
        if (isNaN(commentId)) return [400, 'Invalid commentId parameter'];

        const err = this._postService.editComment(text, commentId, user);
        if (err instanceof NotAllowedError) return [403, 'Forbidden'];
        else if (err instanceof CommentNotFoundError)
            return [404, 'Comment not found'];
        else return [200, null];
    }
}

import {
    Controller,
    Post,
    Body,
    UseGuards,
    Delete,
    Patch,
    UseInterceptors,
} from '@nestjs/common';
import { User, AuthGuard } from './AuthGuard';
import {
    PostNotFoundError,
    NotAllowedError,
    CommentNotFoundError,
} from '../modules/posts/errors';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { PostFacade } from '../modules/posts/PostFacade';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/comments')
export class CommentController {
    constructor(private readonly _postFacade: PostFacade) {}

    @UseGuards(AuthGuard)
    @Post('/')
    public async createComment(
        @Body('text') text: string,
        @Body('postId') postIdParam: string,
        @User() userTag: string
    ) {
        const postId = Number(postIdParam);
        if (isNaN(postId)) return [400, 'Invalid postId parameter'];

        const comment = await this._postFacade.leaveComment(
            text,
            postId,
            userTag
        );
        if (comment instanceof PostNotFoundError)
            return [404, 'Post not found'];
        else return [200, comment];
    }

    @UseGuards(AuthGuard)
    @Delete('/')
    public async deleteComment(
        @Body('commentId') commentIdParam: string,
        @User() userTag: string
    ) {
        const commentId = Number(commentIdParam);
        if (isNaN(commentId)) return [400, 'Invalid commentId parameter'];

        if ((await this._postFacade.deleteComment(commentId, userTag)) === null)
            return [200, null];
        else return [403, 'Forbidden'];
    }

    @UseGuards(AuthGuard)
    @Patch('/')
    public async editComment(
        @Body('commentId') commentIdParam: string,
        @Body('text') text: string,
        @User() userTag: string
    ) {
        const commentId = Number(commentIdParam);
        if (isNaN(commentId)) return [400, 'Invalid commentId parameter'];

        const err = this._postFacade.editComment(text, commentId, userTag);
        if (err instanceof NotAllowedError) return [403, 'Forbidden'];
        else if (err instanceof CommentNotFoundError)
            return [404, 'Comment not found'];
        else return [200, null];
    }
}

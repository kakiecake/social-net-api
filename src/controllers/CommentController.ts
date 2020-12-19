import {
    Controller,
    Post,
    Body,
    UseGuards,
    Delete,
    UseInterceptors,
    Param,
    Put,
} from '@nestjs/common';
import { User, AuthGuard } from './AuthGuard';
import { NotAllowedError, CommentNotFoundError } from '../modules/posts/errors';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { PostFacade } from '../modules/posts/PostFacade';
import { CommentIdParams } from './dto/CommentIdParams';
import { EditCommentDTO } from './dto/EditCommentDTO';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/comments')
export class CommentController {
    constructor(private readonly _postFacade: PostFacade) {}

    @UseGuards(AuthGuard)
    @Delete('/:commentId')
    public async deleteComment(
        @Param() params: CommentIdParams,
        @User() userTag: string
    ) {
        const err = await this._postFacade.deleteComment(
            params.commentId,
            userTag
        );
        if (err == null) return [200, null];
        else return [403, 'Forbidden'];
    }

    @UseGuards(AuthGuard)
    @Put('/:commentId')
    public async editComment(
        @Param('commentId') params: CommentIdParams,
        @Body() body: EditCommentDTO,
        @User() userTag: string
    ) {
        const err = this._postFacade.editComment(
            body.text,
            params.commentId,
            userTag
        );
        if (err instanceof NotAllowedError) return [403, 'Forbidden'];
        else if (err instanceof CommentNotFoundError)
            return [404, 'Comment not found'];
        else return [200, null];
    }

    @UseGuards(AuthGuard)
    @Post('/:commentId/like')
    public async likeComment(
        @Param('commentId') params: CommentIdParams,
        @User() userTag: string
    ) {
        const likes = await this._postFacade.likeComment(
            params.commentId,
            userTag
        );
        return [200, likes];
    }
}

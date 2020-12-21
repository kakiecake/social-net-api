import {
    Controller,
    Post,
    Body,
    UseGuards,
    Delete,
    UseInterceptors,
    Param,
    Put,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { User, AuthGuard } from './AuthGuard';
import { NotAllowedError, CommentNotFoundError } from '../modules/posts/errors';
import { HttpResponseInterceptor } from './HTTPResponseInterceptor';
import { PostFacade } from '../modules/posts/PostFacade';
import { EditCommentDTO } from './dto/EditCommentDTO';

@UseInterceptors(HttpResponseInterceptor)
@Controller('/comments')
export class CommentController {
    constructor(private readonly _postFacade: PostFacade) {}

    @UseGuards(AuthGuard)
    @Delete('/:commentId')
    public async deleteComment(
        @Param('commentId') commentId: number,
        @User() userTag: string
    ): Promise<ForbiddenException | void> {
        const err = await this._postFacade.deleteComment(commentId, userTag);
        if (err) return new ForbiddenException();
    }

    @UseGuards(AuthGuard)
    @Put('/:commentId')
    public async editComment(
        @Param('commentId') commentId: number,
        @Body() body: EditCommentDTO,
        @User() userTag: string
    ): Promise<ForbiddenException | NotFoundException | void> {
        console.log(commentId, typeof commentId);
        const err = this._postFacade.editComment(body.text, commentId, userTag);
        if (err instanceof NotAllowedError) new ForbiddenException();
        else if (err instanceof CommentNotFoundError)
            return new NotFoundException('Comment not found');
    }

    @UseGuards(AuthGuard)
    @Post('/:commentId/like')
    public async likeComment(
        @Param('commentId') commentId: number,
        @User() userTag: string
    ): Promise<number> {
        return this._postFacade.likeComment(commentId, userTag);
    }
}

import { IsNumberString } from 'class-validator';

export class CommentIdParams {
    @IsNumberString()
    commentId: number;
}

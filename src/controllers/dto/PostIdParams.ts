import { IsNumberString } from 'class-validator';

export class PostIdParams {
    @IsNumberString()
    postId: number;
}

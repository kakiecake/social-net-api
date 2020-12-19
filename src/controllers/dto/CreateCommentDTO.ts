import { MaxLength } from 'class-validator';

export class CreateCommentDTO {
    @MaxLength(250)
    text: string;
}

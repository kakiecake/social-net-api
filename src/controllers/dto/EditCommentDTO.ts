import { MaxLength } from 'class-validator';

export class EditCommentDTO {
    @MaxLength(250)
    text: string;
}

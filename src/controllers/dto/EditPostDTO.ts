import { MaxLength } from 'class-validator';

export class EditPostDTO {
    @MaxLength(60)
    title: string;

    @MaxLength(500)
    text: string;
}

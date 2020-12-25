import { MaxLength } from 'class-validator';

export class CreatePostDTO {
    @MaxLength(60)
    title: string;

    @MaxLength(500)
    text: string;
}

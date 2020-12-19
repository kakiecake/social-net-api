import { IsNumberString, MaxLength } from 'class-validator';

export class EditPostDTO {
    @IsNumberString()
    id: number;

    @MaxLength(60)
    title: string;

    @MaxLength(500)
    text: string;
}

import { Validate } from 'class-validator';
import { UserTag } from './UserTag';

export class LoginUserDTO {
    @Validate(UserTag)
    tag: string;

    password: string;
}

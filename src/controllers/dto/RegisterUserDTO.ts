import { UserTag } from './UserTag';
import { Validate } from 'class-validator';

export class RegisterUserDTO {
    @Validate(UserTag)
    tag: string;
    fullName: string;
    password: string;
}

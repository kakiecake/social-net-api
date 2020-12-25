import { UserTag } from './UserTag';
import { Validate } from 'class-validator';

export class UserTagParams {
    @Validate(UserTag)
    userTag: string;
}

import { UserService } from './UserService';
import { UserTag } from './UserEntity';
import { UserView } from './UserView';

export class UserFacade {
    constructor(private readonly _userService: UserService) {}

    registerUser(
        tag: UserTag,
        fullName: string,
        password: string
    ): Promise<boolean> {
        return this._userService.registerUser(tag, fullName, password);
    }

    loginUser(tag: UserTag, password: string): Promise<boolean> {
        return this._userService.loginUser(tag, password);
    }

    doesUserExist(tag: UserTag): Promise<boolean> {
        return this._userService.doesUserExist(tag);
    }

    getUserInfo(tag: UserTag): Promise<UserView | null> {
        return this._userService.getUserInfo(tag);
    }
}

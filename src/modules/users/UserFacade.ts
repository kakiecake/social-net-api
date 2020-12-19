import { UserService } from './UserService';
import { UserTag } from './UserEntity';

export class UserFacade {
    constructor(private readonly _userService: UserService) {}

    registerUser(tag: UserTag, fullName: string, password: string) {
        return this._userService.registerUser(tag, fullName, password);
    }

    loginUser(tag: UserTag, password: string) {
        return this._userService.loginUser(tag, password);
    }

    doesUserExist(tag: UserTag): Promise<boolean> {
        return this._userService.doesUserExist(tag);
    }
}

import { Controller, Post, Body } from '@nestjs/common';
import { isUserTag } from '../entities/UserEntity';
import { UserService } from '../services/UserService';

@Controller('/users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Post('/register')
    async register(
        @Body('tag') tag: string,
        @Body('fullName') fullName: string,
        @Body('password') password: string
    ) {
        if (!isUserTag) return 'not a user tag';
        const user = await this._userService.registerUser(
            tag,
            fullName,
            password
        );
        return 'registered';
    }
}

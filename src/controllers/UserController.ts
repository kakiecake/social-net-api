import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { isUserTag } from '../entities/UserEntity';
import { UserService } from '../services/UserService';
import { LoginService } from '../services/LoginService';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/users')
export class UserController {
    constructor(
        private readonly _userService: UserService,
        private readonly _loginService: LoginService
    ) {}

    @Post('/register')
    public async register(
        @Body('tag') tag: string,
        @Body('fullName') fullName: string,
        @Body('password') password: string
    ) {
        if (!isUserTag(tag)) return [400, 'Invalid user tag'];
        const user = await this._userService.registerUser(
            tag,
            fullName,
            password
        );
        if (user instanceof Error) return [400, 'Tag is occupied'];
        return [200, user];
    }

    @Post('/login')
    public async login(
        @Body('tag') tag: string,
        @Body('password') password: string
    ) {
        const user = await this._userService.loginUser(tag, password);
        if (user === null) return [404, 'User not found'];
        const token = this._loginService.createSessionToken(user);
        return [200, token];
    }
}

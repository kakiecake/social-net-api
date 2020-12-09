import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { isUserTag } from '../modules/users/UserEntity';
import { UserFacade } from '../modules/users/UserFacade';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { AuthHandler } from './AuthHandler';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/users')
export class UserController {
    constructor(
        private readonly _authHandler: AuthHandler,
        private readonly _userFacade: UserFacade
    ) {}

    @Post('/register')
    public async register(
        @Body('tag') tag: string,
        @Body('fullName') fullName: string,
        @Body('password') password: string
    ) {
        if (!isUserTag(tag)) return [400, 'Invalid user tag'];
        const user = await this._userFacade.registerUser(
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
        const user = await this._userFacade.loginUser(tag, password);
        if (user === null) return [404, 'User not found'];
        const token = this._authHandler.createSessionToken(user.tag);
        return [200, token];
    }
}

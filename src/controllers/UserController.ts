import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { isUserTag } from '../entities/UserEntity';
import { UserService } from '../services/UserService';
import { LoginService } from '../services/LoginService';

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
        @Body('password') password: string,
        @Res() res: Response
    ) {
        if (!isUserTag(tag)) {
            res.status(400).json({
                success: false,
                error: 'Invalid user tag',
                data: [],
            });
            return;
        }

        const user = await this._userService.registerUser(
            tag,
            fullName,
            password
        );

        if (user instanceof Error) {
            res.status(400).json({
                success: false,
                error: 'Tag is occupied',
                data: [],
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user,
        });
        return;
    }

    @Post('/login')
    public async login(
        @Body('tag') tag: string,
        @Body('password') password: string,
        @Res() res: Response
    ) {
        const user = await this._userService.loginUser(tag, password);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
                data: null,
            });
        } else {
            const token = this._loginService.createSessionToken(user);
            res.status(200).json({
                success: true,
                data: token,
            });
        }
    }
}

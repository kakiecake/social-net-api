import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, User } from './authUtils';
import { UserEntity } from '../entities/UserEntity';

@Controller('/posts')
export class PostController {
    @UseGuards(AuthGuard)
    @Get('/')
    async getPosts(@User() user: UserEntity | null) {
        console.log(user);
        return 'ok';
    }
}

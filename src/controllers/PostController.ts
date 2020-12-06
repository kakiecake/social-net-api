import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, User } from './authUtils';
import { UserEntity } from '../entities/UserEntity';
import { PostService } from '../services/PostService';

@Controller('/posts')
export class PostController {
    constructor(private readonly _postService: PostService) {}

    @UseGuards(AuthGuard)
    @Get('/')
    async getPosts(@User() user: UserEntity) {
        const posts = this._postService.getPostsForUser(user.tag);
    }
}

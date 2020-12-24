import { Controller, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { HttpResponseInterceptor } from './HTTPResponseInterceptor';
import { User, AuthGuard } from './AuthGuard';
import { PostView } from '../modules/posts/PostView';
import { PostFacade } from '../modules/posts/PostFacade';

@Controller('/news')
@UseInterceptors(HttpResponseInterceptor)
export class NewsController {
    constructor(private readonly _postModule: PostFacade) {}

    @Get('/')
    @UseGuards(AuthGuard)
    public async getNewsFeedForUser(
        @User() userTag: string
    ): Promise<PostView[]> {
        return this._postModule.getNewsFeedForUser(userTag);
    }
}

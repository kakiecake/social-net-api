import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    Param,
    Get,
    UseGuards,
} from '@nestjs/common';
import { UserFacade } from '../modules/users/UserFacade';
import { HTTPResponseInterceptor } from './HTTPResponseInterceptor';
import { AuthHandler } from './AuthHandler';
import { SubscriptionFacade } from '../modules/subscriptions/SubscriptionFacade';
import { User, AuthGuard } from './AuthGuard';

const isUserTag = (x: string) => x.startsWith('@') && x.length < 16;

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/users')
export class UserController {
    constructor(
        private readonly _authHandler: AuthHandler,
        private readonly _userFacade: UserFacade,
        private readonly _subscriptionFacade: SubscriptionFacade
    ) {}

    @Get('/:userTag')
    public async getUserInfo(@Param('userTag') userTag: string) {
        if (!isUserTag(userTag)) return [400, 'Invalid user tag'];
        const info = await this._userFacade.getUserInfo(userTag);
        if (info === null) return [404, 'User not found'];
        else return [200, info];
    }

    @Post('/register')
    public async register(
        @Body('tag') tag: string,
        @Body('fullName') fullName: string,
        @Body('password') password: string
    ) {
        if (!isUserTag(tag)) return [400, 'Invalid user tag'];
        const success = await this._userFacade.registerUser(
            tag,
            fullName,
            password
        );
        if (success) return [400, 'Tag is occupied'];
        else return [200, null];
    }

    @Post('/login')
    public async login(
        @Body('tag') tag: string,
        @Body('password') password: string
    ) {
        const user = await this._userFacade.loginUser(tag, password);
        if (user === null) return [404, 'Invalid login/password combination'];
        const token = this._authHandler.createSessionToken(tag);
        return [200, token];
    }

    @Get('/:userTag/subscribers')
    public async getSubscribers(@Param('userTag') userTag: string) {
        const subs = await this._subscriptionFacade.getSubscribers(userTag);
        return [200, subs];
    }

    @Get('/:userTag/subscriptions')
    public async getSubscriptions(@Param('userTag') userTag: string) {
        const subs = await this._subscriptionFacade.getSubscribtions(userTag);
        return [200, subs];
    }

    @UseGuards(AuthGuard)
    @Post('/:subscribeToTag/subscribe')
    public async subscribe(
        @Param('subscribeToTag') subscribeToTag: string,
        @User() userTag: string
    ) {
        if (userTag === subscribeToTag) return [400, 'User tags are equal'];
        const success = await this._subscriptionFacade.subscribe(
            userTag,
            subscribeToTag
        );
        if (!success) return [400, 'Already subscribed'];
        return [200, null];
    }

    @UseGuards(AuthGuard)
    @Post('/:subscribeToTag/subscribe')
    public async unsubscribe(
        @Param('subscribeToTag') subscribeToTag: string,
        @User() userTag: string
    ) {
        if (userTag === subscribeToTag) return [400, 'User tags are equal'];
        const success = await this._subscriptionFacade.unsubscribe(
            userTag,
            subscribeToTag
        );
        if (!success) return [400, 'Already unsubscribed'];
        return [200, null];
    }
}

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
import { RegisterUserDTO } from './dto/RegisterUserDTO';
import { UserTagParams } from './dto/UserTagParams';
import { LoginUserDTO } from './dto/LoginUserDTO';

@UseInterceptors(HTTPResponseInterceptor)
@Controller('/users')
export class UserController {
    constructor(
        private readonly _authHandler: AuthHandler,
        private readonly _userFacade: UserFacade,
        private readonly _subscriptionFacade: SubscriptionFacade
    ) {}

    @Get('/:userTag')
    public async getUserInfo(@Param() params: UserTagParams) {
        const info = await this._userFacade.getUserInfo(params.userTag);
        if (info === null) return [404, 'User not found'];
        else return [200, info];
    }

    @Post('/register')
    public async register(dto: RegisterUserDTO) {
        const success = await this._userFacade.registerUser(
            dto.tag,
            dto.fullName,
            dto.password
        );
        if (success) return [400, 'Tag is occupied'];
        else return [200, null];
    }

    @Post('/login')
    public async login(@Body() body: LoginUserDTO) {
        const user = await this._userFacade.loginUser(body.tag, body.password);
        if (user === null) return [404, 'Invalid login/password combination'];
        const token = this._authHandler.createSessionToken(body.tag);
        return [200, token];
    }

    @Get('/:userTag/subscribers')
    public async getSubscribers(@Param() params: UserTagParams) {
        const subs = await this._subscriptionFacade.getSubscribers(
            params.userTag
        );
        return [200, subs];
    }

    @Get('/:userTag/subscriptions')
    public async getSubscriptions(@Param() params: UserTagParams) {
        const subs = await this._subscriptionFacade.getSubscribtions(
            params.userTag
        );
        return [200, subs];
    }

    @UseGuards(AuthGuard)
    @Post('/:userTag/subscribe')
    public async subscribe(
        @Param() params: UserTagParams,
        @User() userTag: string
    ) {
        if (userTag === params.userTag) return [400, 'User tags are equal'];
        const success = await this._subscriptionFacade.subscribe(
            userTag,
            params.userTag
        );
        if (!success) return [400, 'Already subscribed'];
        return [200, null];
    }

    @UseGuards(AuthGuard)
    @Post('/:userTag/subscribe')
    public async unsubscribe(
        @Param('subscribeToTag') params: UserTagParams,
        @User() userTag: string
    ) {
        if (userTag === params.userTag) return [400, 'User tags are equal'];
        const success = await this._subscriptionFacade.unsubscribe(
            userTag,
            params.userTag
        );
        if (!success) return [400, 'Already unsubscribed'];
        return [200, null];
    }
}

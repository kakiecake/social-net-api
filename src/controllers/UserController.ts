import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    Param,
    Get,
    UseGuards,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { UserFacade } from '../modules/users/UserFacade';
import { HttpResponseInterceptor } from './HTTPResponseInterceptor';
import { AuthHandler } from './AuthHandler';
import { SubscriptionFacade } from '../modules/subscriptions/SubscriptionFacade';
import { User, AuthGuard } from './AuthGuard';
import { RegisterUserDTO } from './dto/RegisterUserDTO';
import { UserTagParams } from './dto/UserTagParams';
import { LoginUserDTO } from './dto/LoginUserDTO';
import { UserView } from '../modules/users/UserView';

@UseInterceptors(HttpResponseInterceptor)
@Controller('/users')
export class UserController {
    constructor(
        private readonly _authHandler: AuthHandler,
        private readonly _userFacade: UserFacade,
        private readonly _subscriptionFacade: SubscriptionFacade
    ) {}

    @Get('/:userTag')
    public async getUserInfo(
        @Param() params: UserTagParams
    ): Promise<UserView | NotFoundException> {
        const user = await this._userFacade.getUserInfo(params.userTag);
        if (user === null) return new NotFoundException('User not found');
        else return user;
    }

    @Post('/register')
    public async register(
        @Body() body: RegisterUserDTO
    ): Promise<BadRequestException | void> {
        const success = await this._userFacade.registerUser(
            body.tag,
            body.fullName,
            body.password
        );
        if (!success) return new BadRequestException('Tag is occupied');
    }

    @Post('/login')
    public async login(
        @Body() body: LoginUserDTO
    ): Promise<string | NotFoundException> {
        const user = await this._userFacade.loginUser(body.tag, body.password);
        if (user === null)
            return new NotFoundException('Invalid login/password combination');
        const token = this._authHandler.createSessionToken(body.tag);
        return token;
    }

    @Get('/:userTag/subscribers')
    public async getSubscribers(
        @Param() params: UserTagParams
    ): Promise<string[]> {
        return this._subscriptionFacade.getSubscribers(params.userTag);
    }

    @Get('/:userTag/subscriptions')
    public async getSubscriptions(
        @Param() params: UserTagParams
    ): Promise<string[]> {
        return this._subscriptionFacade.getSubscribtions(params.userTag);
    }

    @UseGuards(AuthGuard)
    @Post('/:userTag/subscribe')
    public async subscribe(
        @Param() params: UserTagParams,
        @User() userTag: string
    ): Promise<BadRequestException | void> {
        if (userTag === params.userTag)
            new BadRequestException('User tags are equal');
        const success = await this._subscriptionFacade.subscribe(
            userTag,
            params.userTag
        );
        if (!success) return new BadRequestException('Already subscribed');
    }

    @UseGuards(AuthGuard)
    @Post('/:userTag/subscribe')
    public async unsubscribe(
        @Param('subscribeToTag') params: UserTagParams,
        @User() userTag: string
    ): Promise<BadRequestException | void> {
        if (userTag === params.userTag)
            new BadRequestException('User tags are equal');
        const success = await this._subscriptionFacade.unsubscribe(
            userTag,
            params.userTag
        );
        if (!success) return new BadRequestException('Already unsubscribed');
    }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpResponseInterceptor } from './controllers/HTTPResponseInterceptor';
import { CommentController } from './controllers/CommentController';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { AuthGuard } from './controllers/AuthGuard';
import { AuthHandler } from './controllers/AuthHandler';
import config from './config';
import { UserModule } from './modules/users/user.module';
import { PostModule } from './modules/posts/posts.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NewsController } from './controllers/NewsController';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
        }),
        UserModule,
        PostModule,
        SubscriptionsModule,
    ],
    controllers: [
        PostController,
        UserController,
        CommentController,
        NewsController,
    ],
    providers: [
        HttpResponseInterceptor,
        {
            provide: AuthGuard,
            inject: [AuthHandler],
            useFactory: (authHandler: AuthHandler) =>
                new AuthGuard(authHandler),
        },
        {
            provide: AuthHandler,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const privateKey = config.get('jwt.privateKey');
                const expiration = config.get('jwt.expiration');
                return new AuthHandler(privateKey, expiration);
            },
        },
    ],
})
export class AppModule {}

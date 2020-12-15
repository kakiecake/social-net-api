import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HTTPResponseInterceptor } from './controllers/HTTPResponseInterceptor';
import { CommentController } from './controllers/CommentController';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { AuthGuard } from './controllers/AuthGuard';
import { PostFactory } from './modules/posts/PostFactory';
import { CommentFactory } from './modules/posts/CommentFactory';
import { AuthHandler } from './controllers/AuthHandler';
import { UserService } from './modules/users/UserService';
import { UserFactory, IHashingProvider } from './modules/users/UserFactory';
import { SHA256HashingProvider } from './implementations/SHA256HashingProvider';
import { PostService } from './modules/posts/PostService';
import { IPostRepository } from './modules/posts/IPostRepository';
import { ICommentRepository } from './modules/posts/ICommentRepository';
import { UserFacade } from './modules/users/UserFacade';
import { PostFacade } from './modules/posts/PostFacade';
import { UserRepository } from './implementations/UserRepository';
import { CommentRepository } from './implementations/CommentRepository';
import { PostRepository } from './implementations/PostRepository';
import { UserModel } from './implementations/UserModel';
import { PostModel } from './implementations/PostModel';
import { CommentModel } from './implementations/CommentModel';
import { createConnection, Connection } from 'typeorm';
import { LikeRepository } from './implementations/LikeRepository';
import { ILikeRepository } from './modules/posts/ILikeRepository';
import { LikeModel } from './implementations/LikeModel';
import config from './config';

const UserRepositorySymbol = Symbol('UserRepository');
const PostRepositorySymbol = Symbol('PostRepository');
const CommentRepositorySymbol = Symbol('CommentRepository');
const LikeRepositorySymbol = Symbol('LikeRepository');
const HashingProviderSymbol = Symbol('HashingProvider');

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
        }),
    ],
    controllers: [PostController, UserController, CommentController],
    providers: [
        HTTPResponseInterceptor,
        PostFactory,
        CommentFactory,
        {
            provide: UserFactory,
            inject: [HashingProviderSymbol],
            useFactory: (hashingProvider: IHashingProvider) => {
                return new UserFactory(hashingProvider);
            },
        },
        {
            provide: Connection,
            useFactory: () => {
                return createConnection({
                    type: 'sqlite',
                    database: './db.sqlite',
                    entities: [UserModel, PostModel, CommentModel, LikeModel],
                    synchronize: process.env.NODE_ENV !== 'production',
                });
            },
        },
        {
            provide: LikeRepositorySymbol,
            inject: [Connection],
            useFactory: (con: Connection) => new LikeRepository(con),
        },
        {
            provide: UserRepositorySymbol,
            inject: [Connection, UserFactory],
            useFactory: (connection: Connection, factory: UserFactory) =>
                new UserRepository(factory, connection),
        },
        {
            provide: CommentRepositorySymbol,
            inject: [Connection, CommentFactory],
            useFactory: (connection: Connection, factory: CommentFactory) =>
                new CommentRepository(factory, connection),
        },
        {
            provide: PostRepositorySymbol,
            inject: [Connection, PostFactory],
            useFactory: (connection: Connection, factory: PostFactory) =>
                new PostRepository(factory, connection),
        },
        {
            provide: UserService,
            inject: [UserFactory, UserRepositorySymbol, HashingProviderSymbol],
            useFactory: (userFactory, userRepository, hashingProvider) => {
                return new UserService(
                    userFactory,
                    userRepository,
                    hashingProvider
                );
            },
        },
        {
            provide: HashingProviderSymbol,
            useFactory: () => {
                return new SHA256HashingProvider();
            },
        },
        {
            provide: PostService,
            inject: [
                PostRepositorySymbol,
                PostFactory,
                CommentRepositorySymbol,
                CommentFactory,
                LikeRepositorySymbol,
            ],
            useFactory: (
                postRepository: IPostRepository,
                postFactory: PostFactory,
                commentRepository: ICommentRepository,
                commentFactory: CommentFactory,
                likeRepository: ILikeRepository
            ) => {
                return new PostService(
                    postRepository,
                    postFactory,
                    commentRepository,
                    commentFactory,
                    likeRepository
                );
            },
        },
        {
            provide: AuthGuard,
            inject: [AuthHandler],
            useFactory: (authHandler: AuthHandler) =>
                new AuthGuard(authHandler),
        },
        {
            provide: UserFacade,
            inject: [UserService],
            useFactory: (userService: UserService) =>
                new UserFacade(userService),
        },
        {
            provide: PostFacade,
            inject: [PostService],
            useFactory: (postService: PostService) =>
                new PostFacade(postService),
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

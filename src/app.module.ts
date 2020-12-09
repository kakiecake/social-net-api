import { Module } from '@nestjs/common';
import { HTTPResponseInterceptor } from './controllers/HTTPResponseInterceptor';
import { CommentController } from './controllers/CommentController';
import { PostController } from './controllers/PostController';
import { UserController } from './controllers/UserController';
import { AuthGuard } from './controllers/AuthGuard';
import { PostFactory } from './modules/posts/PostFactory';
import { CommentFactory } from './modules/posts/CommentFactory';
import { AuthHandler } from './controllers/AuthHandler';
import { InMemoryUserRepository } from './implementations/InMemoryUserRepository';
import { InMemoryPostRepository } from './implementations/InMemoryPostRepository';
import { UserService } from './modules/users/UserService';
import { UserFactory, IHashingProvider } from './modules/users/UserFactory';
import { SHA256HashingProvider } from './implementations/SHA256HashingProvider';
import { PostService } from './modules/posts/PostService';
import { IPostRepository } from './modules/posts/IPostRepository';
import { ICommentRepository } from './modules/posts/ICommentRepository';
import { InMemoryCommentRepository } from './implementations/InMemoryCommentRepository';
import { UserFacade } from './modules/users/UserFacade';
import { PostFacade } from './modules/posts/PostFacade';

const UserRepositorySymbol = Symbol('UserRepository');
const PostRepositorySymbol = Symbol('PostRepository');
const CommentRepositorySymbol = Symbol('CommentRepository');
const HashingProviderSymbol = Symbol('HashingProvider');

@Module({
    controllers: [PostController, UserController, CommentController],
    providers: [
        HTTPResponseInterceptor,
        PostFactory,
        CommentFactory,
        {
            provide: UserRepositorySymbol,
            useFactory: () => {
                return new InMemoryUserRepository();
            },
        },
        {
            provide: PostRepositorySymbol,
            useFactory: () => {
                return new InMemoryPostRepository();
            },
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
            provide: UserFactory,
            inject: [HashingProviderSymbol],
            useFactory: (hashingProvider: IHashingProvider) => {
                return new UserFactory(hashingProvider);
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
            ],
            useFactory: (
                postRepository: IPostRepository,
                postFactory: PostFactory,
                commentRepository: ICommentRepository,
                commentFactory: CommentFactory
            ) => {
                return new PostService(
                    postRepository,
                    postFactory,
                    commentRepository,
                    commentFactory
                );
            },
        },
        {
            provide: CommentRepositorySymbol,
            useFactory: () => new InMemoryCommentRepository(),
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
            useFactory: () => {
                return new AuthHandler('~privateKey~', 60);
            },
        },
    ],
})
export class AppModule {}

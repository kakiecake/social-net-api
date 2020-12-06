import { Module } from '@nestjs/common';
import { UserService } from './services/UserService';
import { IUserRepository } from './services/IUserRepository';
import { PostController } from './controllers/PostController';
import { LoginService } from './services/LoginService';
import { AuthGuard } from './controllers/authUtils';
import { UserController } from './controllers/UserController';
import { UserFactory, IHashingProvider } from './services/UserFactory';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { InMemoryPostRepository } from './repositories/InMemoryPostRepository';
import { SHA256HashingProvider } from './services/SHA256HashingProvider';
import { PostService } from './services/PostService';
import { IPostRepository } from './services/IPostRepository';
import { PostFactory } from './services/PostFactory';
import { CommentFactory } from './services/CommentFactory';
import { ICommentRepository } from './services/ICommentRepository';
import { InMemoryCommentRepository } from './repositories/InMemoryCommentRepository';

const UserRepositorySymbol = Symbol('UserRepository');
const PostRepositorySymbol = Symbol('PostRepository');
const CommentRepositorySymbol = Symbol('CommentRepository');
const HashingProviderSymbol = Symbol('HashingProvider');

@Module({
    controllers: [PostController, UserController],
    providers: [
        AuthGuard,
        PostFactory,
        CommentFactory,
        {
            provide: LoginService,
            inject: [UserRepositorySymbol],
            useFactory: (userRepository: IUserRepository) => {
                return new LoginService(userRepository, '~privateKey~', 60);
            },
        },
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
            useFactory: () => {
                return new InMemoryCommentRepository();
            },
        },
    ],
})
export class AppModule {}

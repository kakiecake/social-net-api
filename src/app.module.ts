import { Module } from '@nestjs/common';
import { IUserRepository, UserService } from './services/UserService';
import { PostController } from './controllers/PostController';
import { LoginService } from './services/LoginService';
import { AuthGuard } from './controllers/authUtils';
import { UserController } from './controllers/UserController';
import { UserFactory, IHashingProvider } from './services/UserFactory';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import { InMemoryPostRepository } from './repositories/InMemoryPostRepository';
import { SHA256HashingProvider } from './services/SHA256HashingProvider';
import { PostService, IPostRepository } from './services/PostService';
import { PostFactory } from './services/PostFactory';

const UserRepositorySymbol = Symbol('UserRepository');
const PostRepositorySymbol = Symbol('PostRepository');
const HashingProviderSymbol = Symbol('HashingProvider');

@Module({
    controllers: [PostController, UserController],
    providers: [
        AuthGuard,
        {
            provide: LoginService,
            inject: [UserRepositorySymbol],
            useFactory: (userRepository: IUserRepository) => {
                return new LoginService(userRepository, '~privateKey~');
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
            inject: [PostRepositorySymbol, PostFactory],
            useFactory: (
                postRepository: IPostRepository,
                postFactory: PostFactory
            ) => {
                return new PostService(postRepository, postFactory);
            },
        },
        PostFactory,
    ],
})
export class AppModule {}

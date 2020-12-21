import { Module, forwardRef } from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';
import { UserModel } from './UserModel';
import { PostModel } from './PostModel';
import { CommentModel } from './CommentModel';
import { LikeModel } from './LikeModel';
import { SubscriptionModel } from './SubscriptionModel';
import { LikeRepository } from './LikeRepository';
import { UserModule } from '../modules/users/user.module';
import { UserRepository } from './UserRepository';
import { CommentFactory } from '../modules/posts/CommentFactory';
import { CommentRepository } from './CommentRepository';
import { PostFactory } from '../modules/posts/PostFactory';
import { PostRepository } from './PostRepository';
import { SubscriptionRepository } from './SubscriptionRepository';
import { SHA256HashingProvider } from './SHA256HashingProvider';
import { PostModule } from '../modules/posts/posts.module';
import { LikeRepositorySymbol } from '../modules/posts/ILikeRepository';
import { CommentRepositorySymbol } from '../modules/posts/ICommentRepository';
import { PostRepositorySymbol } from '../modules/posts/IPostRepository';
import { HashingProviderSymbol } from '../modules/users/IHashingProvider';
import { UserRepositorySymbol } from '../modules/users/IUserRepository';
import { SubscriptionRepositorySymbol } from '../modules/subscriptions/ISubscriptionRepository';

@Module({
    exports: [
        LikeRepositorySymbol,
        CommentRepositorySymbol,
        PostRepositorySymbol,
        UserRepositorySymbol,
        HashingProviderSymbol,
        SubscriptionRepositorySymbol,
    ],
    imports: [forwardRef(() => UserModule), forwardRef(() => PostModule)],
    providers: [
        {
            provide: Connection,
            useFactory: () => {
                return createConnection({
                    type: 'sqlite',
                    database: './db.sqlite',
                    entities: [
                        UserModel,
                        PostModel,
                        CommentModel,
                        LikeModel,
                        SubscriptionModel,
                    ],
                    synchronize: process.env.NODE_ENV !== 'production',
                });
            },
        },
        {
            provide: CommentRepositorySymbol,
            inject: [Connection, CommentFactory],
            useFactory: (connection: Connection, factory: CommentFactory) =>
                new CommentRepository(factory, connection),
        },
        {
            provide: LikeRepositorySymbol,
            inject: [Connection],
            useFactory: (con: Connection) => new LikeRepository(con),
        },
        {
            provide: UserRepositorySymbol,
            inject: [Connection],
            useFactory: (con: Connection) => new UserRepository(con),
        },
        {
            provide: PostRepositorySymbol,
            inject: [Connection, PostFactory],
            useFactory: (connection: Connection, factory: PostFactory) =>
                new PostRepository(factory, connection),
        },
        {
            provide: SubscriptionRepositorySymbol,
            inject: [Connection],
            useFactory: (con: Connection) => new SubscriptionRepository(con),
        },
        {
            provide: HashingProviderSymbol,
            useFactory: () => {
                return new SHA256HashingProvider();
            },
        },
    ],
})
export class ImplementationsModule {}

import { Module, forwardRef } from '@nestjs/common';
import { PostFacade } from './PostFacade';
import { PostFactory } from './PostFactory';
import { PostService } from './PostService';
import { IPostRepository } from './IPostRepository';
import { ICommentRepository } from './ICommentRepository';
import { CommentFactory } from './CommentFactory';
import { ILikeRepository } from './ILikeRepository';
import { ImplementationsModule } from '../../implementations/implementations.module';
import { LikeRepositorySymbol } from './ILikeRepository';
import { PostRepositorySymbol } from './IPostRepository';
import { CommentRepositorySymbol } from './ICommentRepository';
import { SubscriptionFacade } from '../subscriptions/SubscriptionFacade';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    exports: [PostFacade, PostFactory, CommentFactory],
    imports: [
        forwardRef(() => ImplementationsModule),
        forwardRef(() => SubscriptionsModule),
    ],
    providers: [
        PostFactory,
        CommentFactory,
        {
            provide: PostFacade,
            inject: [PostService],
            useFactory: service => new PostFacade(service),
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
                postRepo: IPostRepository,
                postFactory: PostFactory,
                commentRepo: ICommentRepository,
                commentFactory: CommentFactory,
                likeRepo: ILikeRepository,
                subscriptions: SubscriptionFacade
            ) =>
                new PostService(
                    postRepo,
                    postFactory,
                    commentRepo,
                    commentFactory,
                    likeRepo,
                    subscriptions
                ),
        },
    ],
})
export class PostModule {}

import { InMemoryPostRepository } from '../../../implementations/InMemoryPostRepository';
import { PostService } from '../PostService';
import { PostFactory } from '../PostFactory';
import { InMemoryCommentRepository } from '../../../implementations/InMemoryCommentRepository';
import { CommentFactory } from '../CommentFactory';
import { IPostRepository } from '../IPostRepository';
import { ICommentRepository } from '../ICommentRepository';
import { PostFacade } from '../PostFacade';
import { PostView } from '../PostView';
import {
    NotAllowedError,
    PostNotFoundError,
    CommentNotFoundError,
} from '../errors';
import { InMemoryLikeRepository } from '../../../implementations/InMemoryLikeRepository';
import { ILikeRepository } from '../ILikeRepository';

import faker from 'faker';
import { CommentView } from '../CommentView';
import { SubscriptionFacade } from '../../subscriptions/SubscriptionFacade';
import { mock, when, instance } from 'ts-mockito';

describe('Post module api test', () => {
    let postRepository: IPostRepository;
    let commentRepository: ICommentRepository;
    let postFactory: PostFactory;
    let commentFactory: CommentFactory;
    let service: PostService;
    let facade: PostFacade;
    let likeRepository: ILikeRepository;
    let subscriptionModuleMock: SubscriptionFacade;

    beforeEach(() => {
        subscriptionModuleMock = mock(SubscriptionFacade);
        postRepository = new InMemoryPostRepository();
        commentRepository = new InMemoryCommentRepository();
        postFactory = new PostFactory();
        commentFactory = new CommentFactory();
        likeRepository = new InMemoryLikeRepository();
        service = new PostService(
            postRepository,
            postFactory,
            commentRepository,
            commentFactory,
            likeRepository,
            instance(subscriptionModuleMock)
        );
        facade = new PostFacade(service);
    });

    describe('CRUD on comments', () => {
        let post: PostView;

        beforeEach(async () => {
            const title = faker.lorem.sentence();
            const text = faker.lorem.text();
            const authorTag = '@' + faker.random.word();
            post = await facade.createPost(title, text, authorTag);
        });

        it('creates and gets a comment', async () => {
            const userTag = '@' + faker.random.word();
            const text = faker.lorem.text();

            const comment = await facade.leaveComment(text, post.id, userTag);
            const postComments = await facade.getCommentsForPost(post.id);

            expect(comment).not.toBeInstanceOf(PostNotFoundError);
            expect(postComments).toContainEqual(comment as CommentView);
        });

        describe('Delete a comment', () => {
            let comment: CommentView, authorTag: string;
            beforeEach(async () => {
                const text = faker.lorem.text();
                authorTag = '@' + faker.random.word();
                comment = (await facade.leaveComment(
                    text,
                    post.id,
                    authorTag
                )) as CommentView;
            });

            it("doesn't delete comment if user tag doesn't match author tag", async () => {
                const notAnAuthorTag = '@obviouslynotanauthor';

                const err = await facade.deleteComment(
                    comment.id!,
                    notAnAuthorTag
                );
                const comments = await facade.getCommentsForPost(post.id);

                expect(err).toBeInstanceOf(NotAllowedError);
                expect(comments).toContainEqual(comment);
            });

            it('successfully deletes comment', async () => {
                const err = await facade.deleteComment(comment.id!, authorTag);
                const comments = await facade.getCommentsForPost(post.id);

                expect(err).toBeNull();
                expect(comments).not.toContainEqual(comment);
            });
        });

        describe('Edit a comment', () => {
            let comment: CommentView, authorTag: string;
            beforeEach(async () => {
                const text = faker.lorem.text();
                authorTag = '@' + faker.random.word();
                comment = (await facade.leaveComment(
                    text,
                    post.id,
                    authorTag
                )) as CommentView;
            });

            it('successfully edits a comment', async () => {
                const newText = faker.lorem.text();

                const err = await facade.editComment(
                    newText,
                    comment.id!,
                    authorTag
                );
                const comments = await facade.getCommentsForPost(post.id);
                const editedComment = comments.find(x => x.id === comment.id);

                expect(err).toBeNull();
                expect(comments).not.toContainEqual(comment);
                expect(editedComment).not.toBeUndefined();
                expect(editedComment!.text).toEqual(newText);
            });

            it('returns CommentNotFoundError on no comment', async () => {
                const newText = faker.lorem.text();
                const wrongCommentId = 13123;

                const err = await facade.editComment(
                    newText,
                    wrongCommentId,
                    authorTag
                );
                const comments = await facade.getCommentsForPost(post.id);

                expect(err).toBeInstanceOf(CommentNotFoundError);
                expect(comments).toContainEqual(comment);
            });

            it('returns NotAllowedError if called with wrong authorTag', async () => {
                const newText = faker.lorem.text();
                const wrongAuthorTag = '@notanactualauthor';

                const err = await facade.editComment(
                    newText,
                    comment.id!,
                    wrongAuthorTag
                );
                const comments = await facade.getCommentsForPost(post.id);

                expect(err).toBeInstanceOf(NotAllowedError);
                expect(comments).toContainEqual(comment);
            });
        });
    });

    describe('CRUD on posts', () => {
        describe('Create and get a post', () => {
            const title = faker.random.word();
            const text = faker.lorem.text();
            const authorTag = '@' + faker.random.word();

            it('returns null if post does not exist', async () => {
                const wrongPostId = 2000;
                const post = await facade.getPostById(wrongPostId);
                expect(post).toBeNull();
            });

            it('gets a post successfully', async () => {
                let newPost = await facade.createPost(title, text, authorTag);
                const post = await facade.getPostById(newPost.id);
                expect(post).toEqual(newPost);
            });
        });

        describe('Edit post', () => {
            let title: string, text: string, authorTag: string, post: PostView;
            beforeEach(async () => {
                title = faker.random.word();
                text = faker.lorem.text();
                authorTag = '@' + faker.random.word();
                post = await facade.createPost(title, text, authorTag);
            });

            it('returns a PostNotFoundError on unused ID', async () => {
                const unusedId = 10100;
                const err = await facade.editPost(
                    unusedId,
                    title,
                    text,
                    authorTag
                );
                expect(err).toBeInstanceOf(PostNotFoundError);
            });

            it('returns a NotAllowedError on wrong user tag', async () => {
                const notAnAuthorTag = '@definetlynotanauthor';
                const err = await facade.editPost(
                    post.id,
                    title,
                    text,
                    notAnAuthorTag
                );
                expect(err).toBeInstanceOf(NotAllowedError);
            });

            it('successfully edits a post', async () => {
                const newTitle = faker.random.word();

                const err = await facade.editPost(
                    post.id,
                    newTitle,
                    undefined,
                    authorTag
                );
                const editedPost = await facade.getPostById(post.id);

                expect(err).not.toBeInstanceOf(Error);
                expect(editedPost).not.toBeNull();
                expect(editedPost?.title).toEqual(newTitle);
                expect(editedPost?.text).not.toBeUndefined();
            });
        });

        describe('Delete post', () => {
            let title: string, text: string, authorTag: string, post: PostView;
            beforeEach(async () => {
                title = faker.random.word();
                text = faker.lorem.text();
                authorTag = '@' + faker.random.word();
                post = await facade.createPost(title, text, authorTag);
            });

            it('successfully deletes a post', async () => {
                const err = await facade.deletePost(post.id, authorTag);
                const deletedPost = await facade.getPostById(post.id);

                expect(err).toBeNull();
                expect(deletedPost).toBeNull();
            });

            it('returns a NotAllowedError on wrong authorTag', async () => {
                const wrongAuthorTag = '@notanactualauthor';
                const err = await facade.deletePost(post.id, wrongAuthorTag);
                expect(err).toBeInstanceOf(NotAllowedError);
            });
        });
    });

    describe('Likes', () => {
        let post: PostView;
        beforeEach(async () => {
            const title = faker.random.word();
            const text = faker.lorem.text();
            const authorTag = '@' + faker.random.word();
            post = await facade.createPost(title, text, authorTag);
        });

        describe('Post likes', () => {
            it('likes a post', async () => {
                const likes = await facade.likePost(post.id, post.authorTag);
                const savedPost = await facade.getPostById(post.id);

                expect(savedPost).not.toBeNull();
                expect(savedPost!.likes).toEqual(1);
                expect(likes).toEqual(1);
            });

            it('removes a like after two calls', async () => {
                const firstLikes = await facade.likePost(
                    post.id,
                    post.authorTag
                );
                const secondLikes = await facade.likePost(
                    post.id,
                    post.authorTag
                );
                expect(firstLikes).not.toEqual(secondLikes);
                expect(firstLikes).toEqual(1);
                expect(secondLikes).toEqual(0);
            });

            it('gets a 0 on post with no likes', async () => {
                const savedPost = await facade.getPostById(post.id);
                expect(savedPost).not.toBeNull();
                expect(savedPost!.likes).toEqual(0);
            });
        });

        describe('Comment likes', () => {
            let comment: CommentView, userTag: string;
            beforeEach(async () => {
                const text = faker.lorem.text();
                userTag = '@' + faker.internet.userName();
                comment = (await facade.leaveComment(
                    text,
                    post.id,
                    userTag
                )) as CommentView;
            });

            it('likes comment', async () => {
                const likes = await facade.likeComment(comment.id!, userTag);

                expect(likes).toEqual(1);
            });

            it('removes a like after two calls', async () => {
                const firstLikes = await facade.likeComment(
                    comment.id!,
                    userTag
                );
                const secondLikes = await facade.likeComment(
                    comment.id!,
                    userTag
                );

                expect(firstLikes).not.toEqual(secondLikes);
                expect(firstLikes).toEqual(1);
                expect(secondLikes).toEqual(0);
            });

            it('gets a 0 on comment with no likes', async () => {
                const comments = await facade.getCommentsForPost(post.id);
                const likedComment = comments.find(x => x.id === comment.id);

                expect(likedComment?.likes).toEqual(0);
            });
        });
        describe('news feed', () => {
            it('returns empty array for user with no subscrtiptions', async () => {
                const userTag = '@' + faker.internet.userName();
                when(
                    subscriptionModuleMock.getSubscribtions(userTag)
                ).thenResolve([]);

                const newsFeed = await facade.getNewsFeedForUser(userTag);

                expect(newsFeed).toHaveLength(0);
            });

            it('returns posts for subscriptions', async () => {
                const text = faker.lorem.text();
                const title = faker.lorem.sentence();
                const userTag = '@' + faker.internet.userName();
                const subscriberTag = '@' + faker.internet.userName();
                when(
                    subscriptionModuleMock.getSubscribtions(subscriberTag)
                ).thenResolve([userTag]);

                const post = await facade.createPost(title, text, userTag);
                const newsFeed = await facade.getNewsFeedForUser(subscriberTag);

                expect(newsFeed).toContainEqual(post);
            });
        });
    });
});

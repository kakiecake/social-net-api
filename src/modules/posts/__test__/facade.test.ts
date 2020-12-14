import { InMemoryPostRepository } from '../../../implementations/InMemoryPostRepository';
import { PostService } from '../PostService';
import { PostFactory } from '../PostFactory';
import { InMemoryCommentRepository } from '../../../implementations/InMemoryCommentRepository';
import { CommentFactory } from '../CommentFactory';
import { IPostRepository } from '../IPostRepository';
import { ICommentRepository } from '../ICommentRepository';
import { PostFacade } from '../PostFacade';
import { PostView } from '../PostView';
import { NotAllowedError, PostNotFoundError } from '../errors';
import { InMemoryLikeRepository } from '../../../implementations/InMemoryLikeRepository';
import { ILikeRepository } from '../ILikeRepository';

import faker from 'faker';

describe('Post module api test', () => {
    let postRepository: IPostRepository;
    let commentRepository: ICommentRepository;
    let postFactory: PostFactory;
    let commentFactory: CommentFactory;
    let service: PostService;
    let facade: PostFacade;
    let likeRepository: ILikeRepository;

    beforeAll(() => {
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
            likeRepository
        );
        facade = new PostFacade(service);
    });

    describe('CRUD on posts', () => {
        describe('Create and get a post', () => {
            let title = faker.random.word();
            let text = faker.lorem.text();
            let authorTag = '@' + faker.random.word();

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

        describe('likes', () => {
            let post: PostView;
            beforeEach(async () => {
                const title = faker.random.word();
                const text = faker.lorem.text();
                const authorTag = '@' + faker.random.word();
                post = await facade.createPost(title, text, authorTag);
            });

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
    });
});

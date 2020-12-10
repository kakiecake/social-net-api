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

import faker from 'faker';

describe('Post module api test', () => {
    let postRepository: IPostRepository;
    let commentRepository: ICommentRepository;
    let postFactory: PostFactory;
    let commentFactory: CommentFactory;
    let service: PostService;
    let facade: PostFacade;

    beforeAll(() => {
        postRepository = new InMemoryPostRepository();
        commentRepository = new InMemoryCommentRepository();
        postFactory = new PostFactory();
        commentFactory = new CommentFactory();
        service = new PostService(
            postRepository,
            postFactory,
            commentRepository,
            commentFactory
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
                let newTitle = faker.random.word();

                let editedPost = await facade.editPost(
                    post.id,
                    newTitle,
                    undefined,
                    authorTag
                );

                expect(editedPost).not.toBeInstanceOf(Error);
                expect(editedPost).not.toEqual(post);
                expect((editedPost as PostView).title).toEqual(newTitle);
                expect((editedPost as PostView).text).toEqual(text);
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
});

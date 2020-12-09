import { InMemoryPostRepository } from '../../../implementations/InMemoryPostRepository';
import { PostService } from '../PostService';
import { PostFactory } from '../PostFactory';
import { InMemoryCommentRepository } from '../../../implementations/InMemoryCommentRepository';
import { CommentFactory } from '../CommentFactory';
import { IPostRepository } from '../IPostRepository';
import { ICommentRepository } from '../ICommentRepository';
import { PostFacade } from '../PostFacade';
import { PostView } from '../PostView';
import { NotAllowedError } from '../errors';

describe('post module api test', () => {
    let postRepository: IPostRepository;
    let commentRepository: ICommentRepository;
    let postFactory: PostFactory;
    let commentFactory: CommentFactory;
    let service: PostService;
    let facade: PostFacade;

    beforeEach(() => {
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

    it('creates and gets a post', async () => {
        let title = 'Title';
        let text = 'Text';
        let authorTag = '@author';

        let newPost = await facade.createPost(title, text, authorTag);
        const post = await facade.getPostById(newPost.id);

        expect(post).toEqual(newPost);
    });

    it('edits posts', async () => {
        let title = 'Title';
        let text = 'Text';
        let authorTag = '@author';
        let newTitle = 'New Title';

        const post = await facade.createPost(title, text, authorTag);
        const editedPost = await facade.editPost(
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

    it('deletes posts', async () => {
        let title = 'Title';
        let text = 'Text';
        let authorTag = '@author';
        let wrongAuthorTag = '@nottheauthor';

        let post = await facade.createPost(title, text, authorTag);

        expect(await facade.deletePost(post.id, wrongAuthorTag)).toBeInstanceOf(
            NotAllowedError
        );

        expect(await facade.deletePost(post.id, authorTag)).toBeNull();

        let deletedPost = await facade.getPostById(post.id);
        expect(deletedPost).toBeNull();
    });
});

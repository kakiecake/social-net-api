import { PostView } from './PostView';
import { CommentView } from './CommentView';

export type PostDetailView = PostView & { comments: CommentView[] };

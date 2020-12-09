import { PostId } from './PostEntity';
export type CommentId = number;

export class CommentEntity {
    constructor(
        private _id: CommentId | null,
        private _text: string,
        private _authorTag: string,
        private _postId: PostId,
        private _createdAt: number
    ) {}

    public setId(id: CommentId) {
        if (this._id === null) this._id = id;
    }

    public changeText(text: string) {
        this._text = text;
    }

    get postId() {
        return this._postId;
    }

    get id() {
        return this._id;
    }

    get text() {
        return this._text;
    }

    get authorTag() {
        return this._authorTag;
    }

    get createdAt() {
        return this._createdAt;
    }
}

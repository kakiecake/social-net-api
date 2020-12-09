export type PostId = number;

export class PostEntity {
    constructor(
        private _id: PostId | null,
        private _title: string,
        private _text: string,
        private _authorTag: string,
        private _createdAt: number
    ) {}

    public changeTitle(title: string) {
        this._title = title;
    }

    public changeText(text: string) {
        this._text = text;
    }

    get id() {
        return this._id;
    }

    public setId(id: PostId) {
        if (!this._id) this._id = id;
    }

    get title() {
        return this._title;
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

    get createdAtDate() {
        return new Date(this._createdAt);
    }
}

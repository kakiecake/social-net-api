export type UserTag = string;
export const isUserTag = (str: string): str is UserTag =>
    str.startsWith('@') && str.length <= 16;

export class UserEntity {
    constructor(
        private _fullName: string,
        private _tag: UserTag,
        private _passwordHash: string,
        private _passwordSalt: string,
        private readonly _createdAt: number
    ) {}

    public changeFullName(fullName: string) {
        this._fullName = fullName;
    }

    public changeTag(tag: string) {
        this._tag = tag;
    }

    get passwordHash() {
        return this._passwordHash;
    }

    get passwordSalt() {
        return this._passwordSalt;
    }

    get fullName() {
        return this._fullName;
    }

    get tag() {
        return this._tag;
    }

    get createdAt() {
        return this._createdAt;
    }

    get createdAtDate() {
        return new Date(this._createdAt);
    }
}

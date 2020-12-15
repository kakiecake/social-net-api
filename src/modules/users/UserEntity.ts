export type UserTag = string;

export type UserEntity = {
    fullName: string;
    tag: UserTag;
    readonly passwordHash: string;
    readonly passwordSalt: string;
    readonly createdAt: number;
};

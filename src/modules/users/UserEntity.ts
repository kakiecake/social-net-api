export type UserTag = string;
export const isUserTag = (str: string): str is UserTag =>
    str.startsWith('@') && str.length <= 16;

export type UserEntity = {
    fullName: string;
    tag: UserTag;
    readonly passwordHash: string;
    readonly passwordSalt: string;
    readonly createdAt: number;
};

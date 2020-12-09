import { UserTag } from '../entities/UserEntity';

export type UserView = {
    tag: UserTag;
    fullName: string;
    createdAt: number;
};

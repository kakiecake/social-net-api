import { UserEntity } from './UserEntity';

export const UserRepositorySymbol = Symbol('UserRepository');

export interface IUserRepository {
    findOne(tag: string): Promise<UserEntity | null>;
    save(user: UserEntity): Promise<void>;
}

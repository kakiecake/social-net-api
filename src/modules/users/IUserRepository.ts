import { UserEntity } from '../entities/UserEntity';

export interface IUserRepository {
    findOne(tag: string): Promise<UserEntity | null>;
    save(user: UserEntity): Promise<void>;
}

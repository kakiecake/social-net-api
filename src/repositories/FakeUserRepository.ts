import { IUserRepository } from '../services/UserService';
import { UserTag, UserEntity } from '../entities/UserEntity';

export class FakeUserRepository implements IUserRepository {
    public async findOne(tag: UserTag): Promise<UserEntity | null> {
        return new UserEntity(
            'fullName',
            '@FullName',
            'hash',
            'salt',
            Date.now()
        );
    }
    public async save(user: UserEntity): Promise<void> {}
}

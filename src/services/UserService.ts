import { UserEntity } from '../entities/UserEntity';
import { UserFactory } from './UserFactory';

export interface IUserRepository {
    findOne(tag: string): Promise<UserEntity | null>;
    save(user: UserEntity): Promise<void>;
}

export class UserExistsError extends Error {}

export class UserService {
    constructor(
        private readonly _userFactory: UserFactory,
        private readonly _userRepository: IUserRepository
    ) {}

    async registerUser(
        tag: string,
        fullName: string,
        password: string
    ): Promise<UserEntity | UserExistsError> {
        if ((await this._userRepository.findOne(tag)) !== null)
            return new UserExistsError();
        const user = this._userFactory.createNewUser(fullName, tag, password);
        await this._userRepository.save(user);
        return user;
    }
}

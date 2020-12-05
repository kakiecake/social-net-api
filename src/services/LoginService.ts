import jwt from 'jsonwebtoken';

import { UserEntity, isUserTag } from '../entities/UserEntity';
import { IUserRepository } from './UserService';

export class LoginService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _privateKey: string
    ) {}

    public createSessionToken(user: UserEntity): string {
        const payload = user.tag;
        const token = jwt.sign(payload, this._privateKey);
        return token;
    }

    public async loginBySessionToken(
        token: string
    ): Promise<UserEntity | null | Error> {
        let tokenData: string | object;
        try {
            tokenData = jwt.verify(token, this._privateKey);
        } catch (err) {
            return new Error('Invalid token structure');
        }

        if (typeof tokenData !== 'string' || !isUserTag(tokenData))
            return new Error('Invalid token data');

        return this._userRepository.findOne(tokenData);
    }
}

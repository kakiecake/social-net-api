import jwt from 'jsonwebtoken';

import { UserEntity, isUserTag, UserTag } from '../entities/UserEntity';
import { IUserRepository } from './IUserRepository';

export class LoginService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _privateKey: string,
        private readonly _expiresIn: string | number
    ) {}

    public createSessionToken(user: UserEntity): string {
        const payload = { tag: user.tag };
        const token = jwt.sign(payload, this._privateKey, {
            expiresIn: this._expiresIn,
        });
        return token;
    }

    public async loginBySessionToken(
        token: string
    ): Promise<UserEntity | null | Error> {
        let tokenData: { tag: UserTag };
        try {
            tokenData = jwt.verify(token, this._privateKey) as { tag: UserTag };
        } catch (err) {
            return new Error('Invalid token structure');
        }

        if (
            typeof tokenData !== 'object' ||
            !tokenData.tag ||
            !isUserTag(tokenData.tag)
        )
            return new Error('Invalid token data');

        return this._userRepository.findOne(tokenData.tag);
    }
}

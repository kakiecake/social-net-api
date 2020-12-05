import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { UserEntity, isUserTag, UserTag } from '../entities/UserEntity';

export class LoginService {
    constructor(private readonly _privateKey: string) {}

    public createSessionToken(user: UserEntity): string {
        const payload = user.tag;
        const token = jwt.sign(payload, this._privateKey);
        return token;
    }

    public loginBySessionToken(token: string): UserTag | JsonWebTokenError {
        let tokenData: string | object;
        try {
            tokenData = jwt.verify(token, this._privateKey);
        } catch (err) {
            return err;
        }

        if (typeof tokenData !== 'string' || !isUserTag(tokenData)) {
            return new JsonWebTokenError('Invalid token data');
        } else {
            return tokenData;
        }
    }
}

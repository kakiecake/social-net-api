import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthHandler {
    constructor(
        private readonly _privateKey: string,
        private readonly _expiresIn: string | number
    ) {}

    public createSessionToken(userTag: string): string {
        const payload = { userTag };
        const token = jwt.sign(payload, this._privateKey, {
            expiresIn: this._expiresIn,
        });
        return token;
    }

    public async loginBySessionToken(
        token: string
    ): Promise<string | null | Error> {
        let tokenData: { userTag: string };
        try {
            tokenData = jwt.verify(token, this._privateKey) as {
                userTag: string;
            };
        } catch (err) {
            return new Error('Invalid token structure');
        }

        if (typeof tokenData !== 'object' || !tokenData.userTag)
            return new Error('Invalid token data');

        return tokenData.userTag;
    }
}

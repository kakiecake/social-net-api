import { SHA256 } from 'crypto-js';
import { randomBytes } from 'crypto';

import { IHashingProvider } from './UserFactory';

export class SHA256HashingProvider implements IHashingProvider {
    public generateSalt(): string {
        return randomBytes(32).toString('hex');
    }

    public hash(str: string, salt: string) {
        return SHA256(str + salt).toString();
    }
}

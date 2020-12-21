export const HashingProviderSymbol = Symbol('HashingProvider');

export interface IHashingProvider {
    generateSalt(): string;
    hash(str: string, salt: string): string;
}

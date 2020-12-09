import {
    ExecutionContext,
    CanActivate,
    createParamDecorator,
    Injectable,
} from '@nestjs/common';
import { AuthHandler } from './AuthHandler';

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext):
    | string
    | null => {
    return ctx.switchToHttp().getRequest().user || null;
});

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly _authHandler: AuthHandler) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const sessionToken = request.headers['authorization'];
        if (!sessionToken) return false;

        const user = await this._authHandler.loginBySessionToken(sessionToken);
        if (user instanceof Error) {
            return false;
        } else if (user) {
            request.user = user;
            return true;
        } else {
            return false;
        }
    }
}

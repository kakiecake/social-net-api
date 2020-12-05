import {
    ExecutionContext,
    CanActivate,
    Injectable,
    createParamDecorator,
} from '@nestjs/common';
import { LoginService } from '../services/LoginService';
import { UserEntity } from '../entities/UserEntity';

export const User = createParamDecorator(
    (ctx: ExecutionContext): UserEntity | null => {
        return ctx.switchToHttp().getRequest().user || null;
    }
);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly _loginService: LoginService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const sessionToken = request.headers['authorization'];
        if (!sessionToken) return false;

        const user = await this._loginService.loginBySessionToken(sessionToken);
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

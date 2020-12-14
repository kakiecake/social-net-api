import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
} from '@nestjs/common';
import { ControllerResponse } from './ApiResponse';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class HTTPResponseInterceptor implements NestInterceptor {
    intercept<T extends object | null, E extends string | Error>(
        context: ExecutionContext,
        next: CallHandler<ControllerResponse<T, E>>
    ) {
        const handler = ([statusCode, data]: ControllerResponse<T, E>) => {
            const isSuccess = (statusCode: number): boolean =>
                statusCode >= 200 && statusCode < 300;

            const res: Response = context.switchToHttp().getResponse();

            const success = isSuccess(statusCode);
            let body = success
                ? { success, data }
                : { success, error: data, data: null };
            res.status(statusCode);
            return body;
        };

        return next.handle().pipe(map(handler));
    }
}

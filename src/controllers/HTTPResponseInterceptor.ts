import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    HttpException,
} from '@nestjs/common';
import { ApiResponse } from './ApiResponse';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
    intercept<T extends object, E extends HttpException>(
        context: ExecutionContext,
        next: CallHandler<T | E>
    ) {
        const handler = (data: T | E) => {
            let body: ApiResponse<T>, status: number;
            if (data instanceof HttpException) {
                body = {
                    success: false,
                    error: data.message,
                    data: null,
                };
                status = data.getStatus();
            } else {
                body = {
                    success: true,
                    data: data,
                };
                status = 200;
            }

            const res: Response = context.switchToHttp().getResponse();
            res.status(status);
            return body;
        };

        return next.handle().pipe(map(handler));
    }
}

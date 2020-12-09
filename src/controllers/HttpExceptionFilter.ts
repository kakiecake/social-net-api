import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        // Generic Nest exception object is kinda messy
        const errorResponse = exception.getResponse();
        const errorMessage =
            typeof errorResponse === 'object'
                ? (errorResponse as any).error || 'Error'
                : errorResponse;

        response.status(status).json({
            status: status,
            error: errorMessage,
            data: null,
        });
    }
}

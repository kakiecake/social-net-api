import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status: number, errorMessage: string;
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            // Generic Nest exception object is kinda messy
            const errorResponse = exception.getResponse();
            errorMessage =
                typeof errorResponse === 'object'
                    ? (errorResponse as any).error || 'Error'
                    : errorResponse;
        } else {
            status = 500;
            errorMessage = 'Internal server error';
        }

        response.status(status).json({
            status: status,
            error: errorMessage,
            data: null,
        });
    }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resBody = exception.getResponse();

      this.logger.error(
        `HttpException for ${request.method} ${request.url} -> ${status} ` +
          `body=${JSON.stringify(resBody)}`,
        exception.stack,
        'ExceptionFilter',
      );

      response.status(status).json(resBody);
      return;
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const body = {
      statusCode: status,
      message: 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `Unexpected exception for ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
      'ExceptionFilter',
    );

    response.status(status).json(body);
  }
}

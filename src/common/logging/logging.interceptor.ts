import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';
import { LoggingService } from './logging.service';

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;

  const clone: Record<string, unknown> = {
    ...(body as Record<string, unknown>),
  };

  ['password', 'oldPassword', 'newPassword', 'refreshToken'].forEach((key) => {
    if (key in clone) {
      clone[key] = '***';
    }
  });

  return clone;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const { method, url, query, params, body } = req;

    const safeBody = sanitizeBody(body);

    this.logger.log(
      `Incoming request: ${method} ${url} query=${JSON.stringify(query)} params=${JSON.stringify(
        params,
      )} body=${JSON.stringify(safeBody)}`,
      'HTTP',
    );

    return next.handle().pipe(
      tap(() => {
        const statusCode = res.statusCode;
        const ms = Date.now() - now;

        this.logger.log(
          `Response: ${method} ${url} -> ${statusCode} (${ms}ms)`,
          'HTTP',
        );
      }),
    );
  }
}

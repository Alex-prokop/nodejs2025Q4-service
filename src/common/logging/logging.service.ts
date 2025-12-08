import { Injectable } from '@nestjs/common';

type LogLevelName = 'error' | 'warn' | 'log' | 'debug' | 'verbose';

const LOG_LEVEL_MAP: Record<LogLevelName, number> = {
  error: 0,
  warn: 1,
  log: 2,
  debug: 3,
  verbose: 4,
};

@Injectable()
export class LoggingService {
  private readonly currentLevel: number;

  constructor() {
    const envLevel = process.env.LOG_LEVEL;
    const parsed = envLevel !== undefined ? Number(envLevel) : 2;

    this.currentLevel =
      Number.isFinite(parsed) && parsed >= 0 && parsed <= 4 ? parsed : 2;
  }

  private shouldLog(level: LogLevelName): boolean {
    return LOG_LEVEL_MAP[level] <= this.currentLevel;
  }

  private formatMessage(
    level: LogLevelName,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextPart = context ? `[${context}]` : '';
    const upperLevel = level.toUpperCase();

    return `[${timestamp}] [${upperLevel}]${contextPart} ${message}`;
  }

  private write(level: LogLevelName, message: string, context?: string): void {
    if (!this.shouldLog(level)) return;

    const line = this.formatMessage(level, message, context);

    if (level === 'error') {
      process.stderr.write(line + '\n');
    } else {
      process.stdout.write(line + '\n');
    }
  }

  log(message: string, context?: string): void {
    this.write('log', message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    const fullMessage = trace ? `${message}\n${trace}` : message;
    this.write('error', fullMessage, context);
  }

  warn(message: string, context?: string): void {
    this.write('warn', message, context);
  }

  debug(message: string, context?: string): void {
    this.write('debug', message, context);
  }

  verbose(message: string, context?: string): void {
    this.write('verbose', message, context);
  }
}

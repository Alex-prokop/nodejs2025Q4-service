import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

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
  private readonly logDir: string;
  private readonly maxFileSizeBytes: number;

  private readonly appLogFileName = 'app.log';
  private readonly errorLogFileName = 'error.log';

  constructor() {
    const envLevel = process.env.LOG_LEVEL;
    const parsedLevel = envLevel !== undefined ? Number(envLevel) : 2;

    this.currentLevel =
      Number.isFinite(parsedLevel) && parsedLevel >= 0 && parsedLevel <= 4
        ? parsedLevel
        : 2;

    const envDir = process.env.LOG_DIR || 'logs';
    this.logDir = path.isAbsolute(envDir)
      ? envDir
      : path.join(process.cwd(), envDir);

    const envMaxKb = process.env.LOG_FILE_MAX_SIZE_KB;
    const parsedMaxKb = envMaxKb !== undefined ? Number(envMaxKb) : 100;
    const safeMaxKb =
      Number.isFinite(parsedMaxKb) && parsedMaxKb > 0 ? parsedMaxKb : 100;
    this.maxFileSizeBytes = safeMaxKb * 1024;

    this.ensureLogDir();
  }

  // ==========================
  // PUBLIC METHODS

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

  // ==========================
  // PUBLIC METHODS

  // ==========================
  // INTERNAL LOGIC

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

    const isError = level === 'error';
    try {
      this.writeToFile(line, isError);
    } catch (err) {
      process.stderr.write(
        `[LOGGING ERROR] Failed to write log to file: ${String(err)}\n`,
      );
    }
  }

  // ==========================
  // INTERNAL LOGIC

  // ==========================
  // WORKING WITH FILES

  private ensureLogDir(): void {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (err) {
      process.stderr.write(
        `[LOGGING ERROR] Failed to create log directory "${this.logDir}": ${String(
          err,
        )}\n`,
      );
    }
  }

  private getLogFilePath(isError: boolean): string {
    const fileName = isError ? this.errorLogFileName : this.appLogFileName;
    return path.join(this.logDir, fileName);
  }

  private rotateIfNeeded(filePath: string, nextLineSizeBytes: number): void {
    try {
      if (!fs.existsSync(filePath)) {
        return;
      }

      const { size } = fs.statSync(filePath);
      if (size + nextLineSizeBytes <= this.maxFileSizeBytes) {
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedName = `${filePath}.${timestamp}`;

      fs.renameSync(filePath, rotatedName);
    } catch (err) {
      process.stderr.write(
        `[LOGGING ERROR] Failed to rotate log file "${filePath}": ${String(
          err,
        )}\n`,
      );
    }
  }

  private writeToFile(line: string, isError: boolean): void {
    const filePath = this.getLogFilePath(isError);
    const lineWithNewline = line + '\n';
    const bytes = Buffer.byteLength(lineWithNewline, 'utf8');

    this.rotateIfNeeded(filePath, bytes);

    try {
      fs.appendFileSync(filePath, lineWithNewline, { encoding: 'utf8' });
    } catch (err) {
      process.stderr.write(
        `[LOGGING ERROR] Failed to append log to "${filePath}": ${String(
          err,
        )}\n`,
      );
    }
  }
}

// ==========================
// WORKING WITH FILES

import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { format as dateFormat } from 'date-fns';
import chalk from 'chalk';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;
  private readonly name: string;
  private readonly pid: number;

  constructor() {
    this.name = 'Logger';
    this.pid = process.pid;

    const nestFormat = format.printf(({ level, message, context, timestamp }: any) => {
      const logLevel = level.toUpperCase();
      const contextStr = context ? `[${context}]` : `[${this.name}]`;
      const timestampStr = dateFormat(this.getTimestamp(timestamp), 'MM/dd/yyyy, hh:mm:ss a');
      const { coloredLevel, coloredContext, coloredMessage } = this.getColoredLevels(level, logLevel, contextStr, message);
      return `${chalk.green(`[Nest]`)} ${chalk.green(this.pid)}  - ${chalk.white(timestampStr)}     ${coloredLevel} ${coloredContext} ${chalk.green(coloredMessage)}`;
    });

    const consoleFormat = format.combine(format.timestamp(), nestFormat);
    const fileFormat = format.combine(format.timestamp(), format.errors({ stack: true }), format.json());

    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(format.timestamp({ format: 'MM/dd/yyyy, hh:mm:ss a' }), format.errors({ stack: true }), format.splat(), format.json()),
      defaultMeta: { service: this.name },
      transports: [
        new transports.Console({ format: consoleFormat, level: process.env.LOG_LEVEL || 'info' }),
        new transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
        new transports.File({ filename: 'logs/combined.log', format: fileFormat }),
        new transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  private getColoredLevels(level: string, logLevel: string, contextStr: string, message: string) {
    let coloredLevel: string = logLevel;
    let coloredContext: string = contextStr;
    let coloredMessage: string = message;
    switch (level) {
      case 'error':
        coloredLevel = chalk.red(logLevel);
        coloredContext = chalk.yellow(contextStr);
        coloredMessage = chalk.red(message);
        return { coloredLevel, coloredContext, coloredMessage };
      case 'warn':
        coloredLevel = chalk.yellow(logLevel);
        coloredContext = chalk.yellow(contextStr);
        coloredMessage = chalk.yellow(message);
        return { coloredLevel, coloredContext, coloredMessage };
      case 'debug':
        coloredLevel = chalk.magenta(logLevel);
        coloredContext = chalk.cyan(contextStr);
        coloredMessage = chalk.gray(message);
        return { coloredLevel, coloredContext, coloredMessage };
      case 'verbose':
        coloredLevel = chalk.cyan(logLevel);
        coloredContext = chalk.cyan(contextStr);
        coloredMessage = chalk.cyan(message);
        return { coloredLevel, coloredContext, coloredMessage };
      default:
        coloredLevel = chalk.green(logLevel);
        coloredContext = chalk.yellow(contextStr);
        coloredMessage = message;
        return { coloredLevel, coloredContext, coloredMessage };
    }
  }

  private getTimestamp(timestamp: Date | string) {
    if (timestamp) {
      const parsed = new Date(timestamp);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    } else {
      return new Date();
    }
  }

  log(message: string, ...context: string[]) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}

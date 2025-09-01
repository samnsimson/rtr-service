import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Log the error
    this.logger.error(`HTTP Exception: ${status} - ${request.method} ${request.url}`, exception.stack);

    // Format the error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.extractMessage(exceptionResponse),
      errors: this.extractErrors(exceptionResponse),
    };

    // Send the formatted error response
    response.status(status).json(errorResponse);
  }

  private extractMessage(exceptionResponse: any): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    if (exceptionResponse.message) {
      return Array.isArray(exceptionResponse.message) ? exceptionResponse.message[0] : exceptionResponse.message;
    }
    return 'Internal server error';
  }

  private extractErrors(exceptionResponse: any): any[] {
    if (exceptionResponse.errors) {
      return exceptionResponse.errors;
    }
    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.map((msg: string, index: number) => ({
        field: `field_${index}`,
        message: msg,
      }));
    }
    return [];
  }
}

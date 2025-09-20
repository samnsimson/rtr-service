import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType<'http' | 'graphql'>();

    let method: string;
    let url: string;
    let body: any;
    let headers: any;
    let requestType = 'HTTP';

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      method = request.method;
      url = request.url;
      body = request.body;
      headers = request.headers;
      requestType = 'HTTP';

      this.logger.log(`Incoming Request: ${method} ${url}`, { context: requestType, body: body, headers: headers });

      const startTime = Date.now();
      return next.handle().pipe(
        tap({
          next: () => {
            const responseTime = Date.now() - startTime;
            this.logger.log(`Outgoing Response: ${method} ${url} - ${response.statusCode} (${responseTime}ms)`, { context: requestType });
          },
          error: (error) => {
            const responseTime = Date.now() - startTime;
            this.logger.log(`Error: ${method} ${url} - ${response.statusCode} (${responseTime}ms)`, { context: requestType, error: error });
          },
        }),
      );
    }

    if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const args = gqlContext.getArgs();
      const ctx = gqlContext.getContext();

      method = info.operation.operation; // query, mutation, subscription
      url = info.fieldName;
      body = args;
      headers = ctx?.req?.headers;
      requestType = 'GraphQL';

      this.logger.log(`Incoming Request: ${method} ${url}`);
      this.logger.log(`Request Body: ${JSON.stringify(body)}`);
      this.logger.log(`Request Headers: ${JSON.stringify(headers)}`);

      const startTime = Date.now();
      return next.handle().pipe(
        tap({
          next: () => {
            const responseTime = Date.now() - startTime;
            this.logger.log(`Outgoing Response: ${method} ${url} - 200 (${responseTime}ms)`);
          },
          error: (error) => {
            const responseTime = Date.now() - startTime;
            this.logger.error(`Error: ${method} ${url} - 500 (${responseTime}ms)`, error);
          },
        }),
      );
    }

    return next.handle();
  }
}

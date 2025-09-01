import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GraphQLExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const context = gqlHost.getContext();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Log the GraphQL error
    this.logger.error(`GraphQL Exception: ${status} - ${info.operation.operation} ${info.fieldName}`, exception.stack);

    // For GraphQL, we need to throw a GraphQLError
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const { message, errors, extensions } = exceptionResponse as any;

      throw new GraphQLError(message || 'GraphQL Error', {
        extensions: {
          code: extensions?.code || 'INTERNAL_SERVER_ERROR',
          statusCode: status,
          timestamp: new Date().toISOString(),
          operation: info.operation.operation,
          fieldName: info.fieldName,
          validationErrors: errors || [],
          ...extensions,
        },
      });
    }

    // Fallback to generic GraphQL error
    throw new GraphQLError('GraphQL Error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: status,
        timestamp: new Date().toISOString(),
        operation: info.operation.operation,
        fieldName: info.fieldName,
      },
    });
  }
}

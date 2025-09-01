import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GraphQLValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(GraphQLValidationPipe.name);

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const validationErrors = this.formatGraphQLValidationErrors(errors);
      this.logger.warn(`GraphQL Validation failed: ${JSON.stringify(validationErrors)}`);

      // For GraphQL, we throw a BadRequestException that will be caught by the GraphQL error handler
      throw new BadRequestException({
        message: 'GraphQL Validation failed',
        errors: validationErrors,
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
          validationErrors,
        },
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatGraphQLValidationErrors(errors: any[]): any[] {
    return errors.map((error) => ({
      field: error.property,
      value: error.value,
      constraints: error.constraints,
      children: error.children ? this.formatGraphQLValidationErrors(error.children) : [],
      path: error.property, // GraphQL error path
    }));
  }
}

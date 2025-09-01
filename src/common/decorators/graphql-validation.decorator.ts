import { applyDecorators, UsePipes, UseFilters } from '@nestjs/common';
import { GraphQLValidationPipe } from '../pipes/graphql-validation.pipe';
import { GraphQLExceptionFilter } from '../filters/graphql-exception.filter';

export function GraphQLValidate() {
  return applyDecorators(UsePipes(GraphQLValidationPipe), UseFilters(GraphQLExceptionFilter));
}

export function GraphQLValidateAndTransform() {
  return applyDecorators(UsePipes(GraphQLValidationPipe), UseFilters(GraphQLExceptionFilter));
}

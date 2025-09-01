# Validation and Transformation Setup

This document describes the validation and transformation pipes implemented in the NestJS application, including **GraphQL support**.

## Overview

The application now includes comprehensive validation and transformation capabilities for both **REST and GraphQL**:

- **Global Validation Pipe**: Automatically validates all incoming requests (REST)
- **GraphQL Validation Pipe**: Specifically designed for GraphQL operations
- **Custom Validation Pipe**: Enhanced validation with detailed error logging
- **Transformation Pipe**: Handles data type conversions and transformations
- **Custom Exception Filters**: Provides consistent error response formatting for both REST and GraphQL
- **Custom Decorators**: Easy-to-use validation decorators for specific scenarios

## GraphQL Support

### GraphQL-Specific Features

1. **GraphQL Validation Pipe** (`src/common/pipes/graphql-validation.pipe.ts`)
   - Works specifically with GraphQL resolvers
   - Formats validation errors for GraphQL clients
   - Integrates with GraphQL error handling

2. **GraphQL Exception Filter** (`src/common/filters/graphql-exception.filter.ts`)
   - Converts HTTP exceptions to GraphQL errors
   - Provides structured error information in GraphQL extensions
   - Maintains GraphQL error format standards

3. **GraphQL Validation Decorators**
   - `@GraphQLValidate()`: Apply GraphQL-specific validation
   - `@GraphQLValidateAndTransform()`: Apply validation and transformation

4. **GraphQL Error Configuration** (`src/common/config/graphql-validation.config.ts`)
   - Custom error formatting for GraphQL
   - Validation error extraction and formatting
   - GraphQL-specific error codes

## Features

### 1. Global Validation Pipe (REST)

The global validation pipe is configured in `main.ts` and automatically applies to all REST endpoints:

- **Whitelist**: Only allows properties with decorators
- **Forbid Non-Whitelisted**: Throws error for unknown properties
- **Transform**: Converts payloads to DTO classes
- **Implicit Conversion**: Automatically converts primitive types
- **Error Status**: Returns 422 Unprocessable Entity for validation errors

### 2. GraphQL Validation Pipe

Located at `src/common/pipes/graphql-validation.pipe.ts`:

- **GraphQL-Specific**: Designed specifically for GraphQL operations
- **Error Formatting**: Formats errors for GraphQL clients
- **Extension Support**: Adds validation details to GraphQL error extensions
- **Integration**: Works seamlessly with GraphQL error handling

### 3. Custom Validation Pipe

Located at `src/common/pipes/validation.pipe.ts`:

- Enhanced error logging
- Detailed validation error formatting
- Custom error response structure

### 4. Transformation Pipe

Located at `src/common/pipes/transformation.pipe.ts`:

- Data type conversions
- Implicit type transformations
- Extraneous value exclusion

### 5. Custom Exception Filters

- **HTTP Exception Filter** (`src/common/filters/http-exception.filter.ts`): For REST endpoints
- **GraphQL Exception Filter** (`src/common/filters/graphql-exception.filter.ts`): For GraphQL operations

### 6. Custom Decorators

- **REST Decorators** (`src/common/decorators/validation.decorator.ts`):
  - `@ValidateAndTransform()`: Apply both validation and transformation
  - `@ValidateOnly()`: Apply only validation
  - `@TransformOnly()`: Apply only transformation

- **GraphQL Decorators** (`src/common/decorators/graphql-validation.decorator.ts`):
  - `@GraphQLValidate()`: Apply GraphQL-specific validation
  - `@GraphQLValidateAndTransform()`: Apply validation and transformation for GraphQL

## Usage Examples

### REST Endpoints

The validation is automatically applied to all REST endpoints. No additional configuration needed.

### GraphQL Resolvers

```typescript
import { GraphQLValidate } from '../common/decorators';

@Mutation(() => UserResponse)
@GraphQLValidate()
async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserResponse> {
  // This GraphQL mutation will use GraphQL-specific validation
  return this.service.create(createUserInput);
}
```

### Custom Validation on Specific Endpoints

```typescript
import { ValidateAndTransform } from '../common/decorators';

@Post()
@ValidateAndTransform()
async create(@Body() createDto: CreateUserDto) {
  // This REST endpoint will use custom validation and transformation
  return this.service.create(createDto);
}
```

## Error Response Format

### REST Validation Errors

```json
{
  "statusCode": 422,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/users",
  "method": "POST",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "value": "invalid-email",
      "constraints": {
        "isEmail": "email must be an email"
      }
    }
  ]
}
```

### GraphQL Validation Errors

```json
{
  "errors": [
    {
      "message": "GraphQL Validation failed",
      "extensions": {
        "code": "VALIDATION_ERROR",
        "statusCode": 400,
        "timestamp": "2024-01-01T00:00:00.000Z",
        "operation": "mutation",
        "fieldName": "createUser",
        "validationErrors": [
          {
            "field": "email",
            "value": "invalid-email",
            "constraints": {
              "isEmail": "email must be an email"
            },
            "path": "email"
          }
        ]
      }
    }
  ]
}
```

## Configuration

### REST Validation

Validation options can be customized in `src/common/config/validation.config.ts`:

- `whitelist`: Remove non-decorated properties
- `forbidNonWhitelisted`: Throw error for unknown properties
- `transform`: Enable data transformation
- `enableImplicitConversion`: Auto-convert primitive types
- `errorHttpStatusCode`: HTTP status for validation errors

### GraphQL Validation

GraphQL validation is configured in `src/common/config/graphql-validation.config.ts`:

- Custom error formatting
- Validation error extraction
- GraphQL-specific error codes
- Error extension handling

## DTO Validation

All DTOs should include proper validation decorators for both REST and GraphQL:

```typescript
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}
```

## Best Practices

1. **Always use validation decorators** in DTOs
2. **Use GraphQL-specific decorators** for GraphQL resolvers
3. **Keep validation rules consistent** across similar fields
4. **Use appropriate validation types** (IsEmail, IsUUID, etc.)
5. **Handle validation errors gracefully** in services
6. **Log validation failures** for debugging
7. **Test validation scenarios** in both REST and GraphQL contexts

## Testing

### REST Validation Testing

1. Send invalid data to REST endpoints
2. Verify error responses are properly formatted
3. Check that validation errors are logged
4. Ensure proper HTTP status codes are returned

### GraphQL Validation Testing

1. Send invalid data to GraphQL mutations/queries
2. Verify GraphQL error responses are properly formatted
3. Check error extensions contain validation details
4. Ensure GraphQL error codes are correct

## Troubleshooting

### Common Issues

1. **Validation not working**: Check if DTOs have proper decorators
2. **GraphQL validation errors**: Verify GraphQL decorators are used
3. **Transformation errors**: Verify DTO class definitions
4. **Error format issues**: Check exception filter configuration
5. **Performance issues**: Review validation pipe options

### GraphQL-Specific Issues

1. **GraphQL validation not working**: Ensure `@GraphQLValidate()` decorator is used
2. **Error format incorrect**: Check GraphQL exception filter configuration
3. **Validation errors not showing**: Verify GraphQL error formatting configuration

### Debug Mode

Enable debug logging by setting log level to debug in your environment configuration.

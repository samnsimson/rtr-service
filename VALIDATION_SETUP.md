# Validation and Transformation Setup

This document describes the validation and transformation pipes implemented in the NestJS application.

## Overview

The application now includes comprehensive validation and transformation capabilities:

- **Global Validation Pipe**: Automatically validates all incoming requests
- **Custom Validation Pipe**: Enhanced validation with detailed error logging
- **Transformation Pipe**: Handles data type conversions and transformations
- **Custom Exception Filter**: Provides consistent error response formatting
- **Custom Decorators**: Easy-to-use validation decorators for specific scenarios

## Features

### 1. Global Validation Pipe

The global validation pipe is configured in `main.ts` and automatically applies to all endpoints:

- **Whitelist**: Only allows properties with decorators
- **Forbid Non-Whitelisted**: Throws error for unknown properties
- **Transform**: Converts payloads to DTO classes
- **Implicit Conversion**: Automatically converts primitive types
- **Error Status**: Returns 422 Unprocessable Entity for validation errors

### 2. Custom Validation Pipe

Located at `src/common/pipes/validation.pipe.ts`:

- Enhanced error logging
- Detailed validation error formatting
- Custom error response structure

### 3. Transformation Pipe

Located at `src/common/pipes/transformation.pipe.ts`:

- Data type conversions
- Implicit type transformations
- Extraneous value exclusion

### 4. Custom Exception Filter

Located at `src/common/filters/http-exception.filter.ts`:

- Consistent error response format
- Request context logging
- Structured error messages

### 5. Custom Decorators

Located at `src/common/decorators/validation.decorator.ts`:

- `@ValidateAndTransform()`: Apply both validation and transformation
- `@ValidateOnly()`: Apply only validation
- `@TransformOnly()`: Apply only transformation

## Usage Examples

### Basic Usage

The validation is automatically applied to all endpoints. No additional configuration needed.

### Custom Validation on Specific Endpoints

```typescript
import { ValidateAndTransform } from '../common/decorators';

@Post()
@ValidateAndTransform()
async create(@Body() createDto: CreateUserDto) {
  // This endpoint will use custom validation and transformation
  return this.service.create(createDto);
}
```

### Validation Only

```typescript
import { ValidateOnly } from '../common/decorators';

@Post()
@ValidateOnly()
async create(@Body() createDto: CreateUserDto) {
  // This endpoint will use only validation
  return this.service.create(createDto);
}
```

## Error Response Format

Validation errors return a structured response:

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

## Configuration

Validation options can be customized in `src/common/config/validation.config.ts`:

- `whitelist`: Remove non-decorated properties
- `forbidNonWhitelisted`: Throw error for unknown properties
- `transform`: Enable data transformation
- `enableImplicitConversion`: Auto-convert primitive types
- `errorHttpStatusCode`: HTTP status for validation errors

## DTO Validation

All DTOs should include proper validation decorators:

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
2. **Keep validation rules consistent** across similar fields
3. **Use appropriate validation types** (IsEmail, IsUUID, etc.)
4. **Handle validation errors gracefully** in services
5. **Log validation failures** for debugging
6. **Test validation scenarios** in unit tests

## Testing

To test validation:

1. Send invalid data to endpoints
2. Verify error responses are properly formatted
3. Check that validation errors are logged
4. Ensure proper HTTP status codes are returned

## Troubleshooting

### Common Issues

1. **Validation not working**: Check if DTOs have proper decorators
2. **Transformation errors**: Verify DTO class definitions
3. **Error format issues**: Check exception filter configuration
4. **Performance issues**: Review validation pipe options

### Debug Mode

Enable debug logging by setting log level to debug in your environment configuration.

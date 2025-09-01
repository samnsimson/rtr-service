import { ValidationPipeOptions } from '@nestjs/common';

export const validationConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidUnknownValues: true,
  skipMissingProperties: false,
  skipNullProperties: false,
  skipUndefinedProperties: false,
  validationError: { target: false, value: false },
  errorHttpStatusCode: 422,
  disableErrorMessages: false,
  dismissDefaultMessages: false,
  stopAtFirstError: false,
};

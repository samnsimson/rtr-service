import { applyDecorators, UsePipes } from '@nestjs/common';
import { CustomValidationPipe } from '../pipes/validation.pipe';
import { TransformationPipe } from '../pipes/transformation.pipe';

export function ValidateAndTransform() {
  return applyDecorators(UsePipes(CustomValidationPipe, TransformationPipe));
}

export function ValidateOnly() {
  return applyDecorators(UsePipes(CustomValidationPipe));
}

export function TransformOnly() {
  return applyDecorators(UsePipes(TransformationPipe));
}

import { PipeTransform, Injectable, ArgumentMetadata, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransformationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(TransformationPipe.name);

  transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toTransform(metatype)) {
      return value;
    }

    try {
      const transformed = plainToClass(metatype, value, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });

      this.logger.debug(`Transformed value: ${JSON.stringify(transformed)}`);
      return transformed;
    } catch (error) {
      this.logger.error(`Transformation failed: ${error.message}`);
      return value;
    }
  }

  private toTransform(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe<T extends z.ZodType>
  implements PipeTransform<unknown, z.output<T>>
{
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Dados da requisição inválidos',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}

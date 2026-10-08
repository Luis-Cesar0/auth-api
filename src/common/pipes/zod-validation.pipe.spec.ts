import { BadRequestException } from '@nestjs/common';
import { loginSchema } from '../../auth/DTOS/auth';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe(loginSchema);

  it('returns valid data and strips unknown fields', () => {
    expect(
      pipe.transform({
        email: 'user@example.com',
        password: 'secret1',
        admin: true,
      }),
    ).toEqual({ email: 'user@example.com', password: 'secret1' });
  });

  it('returns field-level details for invalid data', () => {
    try {
      pipe.transform({ email: 'not-an-email', password: 'x' });
      throw new Error('Expected validation to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      if (!(error instanceof BadRequestException)) throw error;

      const response = error.getResponse();
      if (typeof response !== 'object' || response === null) {
        throw new Error('Expected a structured validation response');
      }

      const body = response as {
        message?: string;
        errors?: Array<{ field: string; message: string }>;
      };
      expect(body.message).toBe('Dados da requisição inválidos');
      expect(body.errors?.map((issue) => issue.field)).toEqual([
        'email',
        'password',
      ]);
    }
  });
});

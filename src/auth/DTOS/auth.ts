import { z } from 'zod';

const emailSchema = z.email({ error: 'E-mail inválido' });

const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter pelo menos 6 caracteres')
  .max(64, 'Senha muito longa')
  .refine(
    (password) => Buffer.byteLength(password, 'utf8') <= 72,
    'Senha ultrapassa o limite suportado pelo bcrypt',
  );

export const cadastroSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: emailSchema,
  password: passwordSchema.regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
    'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial',
  ),
});

export type CadastroDTO = z.infer<typeof cadastroSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginDTO = z.infer<typeof loginSchema>;

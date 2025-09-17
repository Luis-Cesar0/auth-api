import z from 'zod';

export const cadastro = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),

  email: z.email({ error: 'E-mail inválido' }),

  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(64, 'Senha muito longa')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
      'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial',
    ),
});

export type CadastroDTO = z.infer<typeof cadastro>;

export const login = z.object({
  email: z.email('E-mail inválido'),

  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginDTO = z.infer<typeof login>;

# Auth API

API REST de autenticação construída com NestJS, TypeScript, PostgreSQL e Prisma. O projeto concentra cadastro, login com e-mail e senha, emissão de JWT e consulta a uma rota protegida. Schemas Zod validam os corpos das requisições em runtime.

## Funcionalidades

- Cadastro com validação de nome, e-mail e senha.
- Hash de senha com bcrypt antes de persistir no PostgreSQL.
- Login com resposta genérica para credenciais inválidas.
- JWT assinado com HS256, payload tipado (`sub`, `email` e `name`) e duração de 15 minutos.
- Guard para validar tokens Bearer e proteger `GET /auth/perfil`.
- Erros de e-mail duplicado retornados como HTTP 409; falhas inesperadas não expõem detalhes do banco.
- Prisma Client gerado do schema e migrations versionadas.

## Requisitos

- Node.js 22.6 ou superior.
- pnpm 11.25.0.
- Docker com Docker Compose, ou PostgreSQL compatível.

## Desenvolvimento local

Copie o arquivo de exemplo e inicie o banco local:

```sh
cp .env.example .env
docker compose up -d db
```

No PowerShell, use `Copy-Item .env.example .env` no lugar do comando `cp`.

O `.env.example` contém somente valores de demonstração para desenvolvimento. Substitua `JWT_SECRET` por um valor aleatório com pelo menos 32 bytes e mantenha `.env` fora do Git. `DATABASE_URL` deve usar o mesmo usuário, senha, banco e porta definidos para o PostgreSQL.

Instale dependências, aplique as migrations existentes e inicie o servidor:

```sh
pnpm install --frozen-lockfile
pnpm db:migrate:deploy
pnpm start:dev
```

A API fica disponível em `http://localhost:3000`. O Prisma Client é gerado durante o build; também pode ser gerado manualmente com `pnpm prisma:generate`.

## Rotas

### `POST /auth/cadastra`

Recebe `name`, `email` e `password`. A senha precisa ter ao menos seis caracteres, uma letra maiúscula, um número e um caractere especial; ela também respeita o limite em bytes do bcrypt.

### `POST /auth/login`

Recebe `email` e `password`. Em caso de sucesso, retorna `accessToken`; credenciais incorretas recebem HTTP 401.

### `GET /auth/perfil`

Rota protegida. Envie `Authorization: Bearer <accessToken>` para receber `sub`, `email` e `name` do token validado.

Corpos inválidos retornam HTTP 400 com a lista de campos e mensagens de validação. Nenhuma rota retorna a senha ou seu hash.

## Comandos

| Comando                  | Função                                           |
| ------------------------ | ------------------------------------------------ |
| `pnpm start:dev`         | Servidor de desenvolvimento com watch            |
| `pnpm build`             | Gerar Prisma Client e compilar a API             |
| `pnpm start:prod`        | Iniciar a compilação de produção                 |
| `pnpm db:migrate:dev`    | Criar/aplicar migration em desenvolvimento       |
| `pnpm db:migrate:deploy` | Aplicar migrations versionadas                   |
| `pnpm db:studio`         | Abrir Prisma Studio                              |
| `pnpm format`            | Formatar código e documentação                   |
| `pnpm format:check`      | Conferir formatação                              |
| `pnpm lint`              | ESLint sem correção automática                   |
| `pnpm typecheck`         | Verificar os tipos TypeScript                    |
| `pnpm test`              | Executar testes unitários                        |
| `pnpm check`             | Executar formatação, lint, tipos, testes e build |

## Estrutura

```text
src/
├── auth/       # Rotas, serviço, guard e schemas Zod
├── common/     # Pipe de validação reutilizável
├── prisma/     # Client e módulo de persistência
├── app.module.ts
└── main.ts
prisma/
├── migrations/
└── schema.prisma
```

## Próximas evoluções

O escopo atual é uma API simples de autenticação: não há refresh tokens, revogação de sessões, confirmação de e-mail, recuperação de senha ou limitação de tentativas. Para uso exposto à internet, recomendo adicionar rate limiting e HTTPS; para um produto com sessões longas, desenhar refresh e revogação conforme os requisitos. A licença do código também deve ser definida antes de aceitar contribuições ou reutilização por terceiros.

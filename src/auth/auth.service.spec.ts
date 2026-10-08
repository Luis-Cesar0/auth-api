import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  type UserCreateArgs = {
    data: { name: string; email: string; password: string };
  };

  type UserLookupArgs = { where: { email: string } };

  const user = {
    id: 'user-id',
    name: 'Luis César',
    email: 'luis@example.com',
    password: 'stored-hash',
  };

  let service: AuthService;
  let prismaService: PrismaService;
  let userFindUnique: jest.Mock<Promise<typeof user | null>, [UserLookupArgs]>;
  let userCreate: jest.Mock<Promise<{ name: string }>, [UserCreateArgs]>;
  let signAsync: jest.Mock<
    Promise<string>,
    [{ sub: string; email: string; name: string }]
  >;

  beforeEach(() => {
    userFindUnique = jest.fn<Promise<typeof user | null>, [UserLookupArgs]>();
    userCreate = jest.fn<Promise<{ name: string }>, [UserCreateArgs]>();
    signAsync = jest.fn<
      Promise<string>,
      [{ sub: string; email: string; name: string }]
    >();
    prismaService = {
      user: { findUnique: userFindUnique, create: userCreate },
    } as unknown as PrismaService;
    service = new AuthService(prismaService, {
      signAsync,
    } as unknown as JwtService);
  });

  it('hashes passwords before creating an account', async () => {
    userCreate.mockResolvedValue({ name: 'Luis César' });

    await expect(
      service.cadastra({
        name: 'Luis César',
        email: 'luis@example.com',
        password: 'Secret1!',
      }),
    ).resolves.toEqual({ name: 'Luis César' });

    const createArgs = userCreate.mock.calls[0]?.[0];
    expect(createArgs).toBeDefined();
    if (!createArgs) throw new Error('Expected the user to be persisted');

    expect(createArgs.data.password).toMatch(/^\$2[ab]\$12\$/);
    await expect(
      bcrypt.compare('Secret1!', createArgs.data.password),
    ).resolves.toBe(true);
  });

  it('signs a payload that matches the guard contract after valid login', async () => {
    userFindUnique.mockResolvedValue({
      ...user,
      password: await bcrypt.hash('Secret1!', 4),
    });
    signAsync.mockResolvedValue('signed-token');

    await expect(
      service.login({ email: user.email, password: 'Secret1!' }),
    ).resolves.toEqual({ accessToken: 'signed-token' });

    expect(signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  });

  it('rejects unknown users and incorrect passwords', async () => {
    userFindUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'missing@example.com', password: 'Secret1!' }),
    ).rejects.toThrow(new UnauthorizedException('Credenciais inválidas'));

    userFindUnique.mockResolvedValue({
      ...user,
      password: await bcrypt.hash('Secret1!', 4),
    });
    await expect(
      service.login({ email: user.email, password: 'WrongPass1!' }),
    ).rejects.toThrow(new UnauthorizedException('Credenciais inválidas'));
  });
});

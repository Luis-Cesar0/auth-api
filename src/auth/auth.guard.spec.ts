import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedRequest, JwtPayload } from './auth.guard';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const payload: JwtPayload = {
    sub: 'user-id',
    email: 'user@example.com',
    name: 'User',
  };

  let verifyAsync: jest.Mock;
  let guard: AuthGuard;

  function createContext(authorization?: string): {
    context: ExecutionContext;
    request: AuthenticatedRequest;
  } {
    const request = {
      headers: authorization ? { authorization } : {},
    } as unknown as AuthenticatedRequest;
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    return { context, request };
  }

  beforeEach(() => {
    verifyAsync = jest.fn();
    guard = new AuthGuard({ verifyAsync } as unknown as JwtService);
  });

  it('verifies Bearer tokens and attaches the typed payload to the request', async () => {
    verifyAsync.mockResolvedValue(payload);
    const { context, request } = createContext('bEaReR signed-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(verifyAsync).toHaveBeenCalledWith('signed-token', {
      algorithms: ['HS256'],
    });
    expect(request.user).toEqual(payload);
  });

  it.each([undefined, 'Basic signed-token', 'Bearer', 'Bearer token extra'])(
    'rejects an invalid authorization header: %s',
    async (authorization) => {
      const { context } = createContext(authorization);

      await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(verifyAsync).not.toHaveBeenCalled();
    },
  );

  it('does not expose token verification errors', async () => {
    verifyAsync.mockRejectedValue(new Error('invalid signature'));
    const { context } = createContext('Bearer tampered-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Acesso negado'),
    );
  });
});

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Acesso negado');
    }

    try {
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token, {
        algorithms: ['HS256'],
      });
      return true;
    } catch {
      throw new UnauthorizedException('Acesso negado');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) return undefined;

    const [scheme, token, extra] = authorization.trim().split(/\s+/);
    if (scheme?.toLowerCase() !== 'bearer' || !token || extra) {
      return undefined;
    }

    return token;
  }
}

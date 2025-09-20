// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstantes } from './constants';
import { Request } from 'express';

// Defina o payload que você codifica no token
export interface JwtPayload {
  sub: string; // id do usuário
  email: string;
  iat?: number;
  exp?: number;
}

// (opção B) request tipado com user
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // precisa ser Promise<boolean> e retornar true ao fim
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Acesso negado');
    }

    try {
      // tipa o retorno do verifyAsync
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtConstantes.secret,
      });

      // anexa o payload no request de forma tipada
      (request as AuthenticatedRequest).user = payload;

      return true;
    } catch (_err) {
      // opcional: logar _err
      throw new UnauthorizedException('Acesso negado');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const auth = request.headers['authorization'];
    if (!auth) return undefined;

    const [type, token] = auth.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}

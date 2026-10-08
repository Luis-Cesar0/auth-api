import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from './auth.guard';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import type { CadastroDTO, LoginDTO } from './DTOS/auth';
import { cadastroSchema, loginSchema } from './DTOS/auth';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('cadastra')
  cadastra(
    @Body(new ZodValidationPipe(cadastroSchema)) cad: CadastroDTO,
  ): Promise<{ name: string }> {
    return this.authService.cadastra(cad);
  }

  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginSchema)) log: LoginDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(log);
  }

  @UseGuards(AuthGuard)
  @Get('perfil')
  perfil(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}

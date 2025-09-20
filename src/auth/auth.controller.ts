import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CadastroDTO, LoginDTO } from './DTOS/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('cadastra')
  async cadastra(@Body() cad: CadastroDTO) {
    return await this.authService.cadastra(cad);
  }

  @Post('login')
  async login(@Body() log: LoginDTO) {
    return await this.authService.login(log);
  }
  @UseGuards(AuthGuard)
  @Get('perfil')
  async perfil(@Req() req) {
    return req.user;
  }
}

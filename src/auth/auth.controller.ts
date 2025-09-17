import { Body, Controller, Post } from '@nestjs/common';
import { CadastroDTO, LoginDTO } from './DTOS/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('cadastra')
  async cadastra(@Body() cad: CadastroDTO) {
    await this.authService.cadastra(cad);
    return cad;
  }

  @Post('login')
  async login(@Body() log: LoginDTO) {
    await this.authService.login(log);

    return log;
  }
}

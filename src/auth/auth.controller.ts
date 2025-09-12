import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('cadastra')
  async cadastra() {}

  @Post('login')
  async login() {}
}

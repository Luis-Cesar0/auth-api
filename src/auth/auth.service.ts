import { Injectable } from '@nestjs/common';
import { CadastroDTO, LoginDTO } from './DTOS/auth';

@Injectable()
export class AuthService {
  async cadastra(cad: CadastroDTO) {
    console.log(cad);
    return cad;
  }

  async login(log: LoginDTO) {
    console.log(log);

    return log;
  }
}

import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CadastroDTO, LoginDTO } from './DTOS/auth';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prismaService: PrismaService) {}

  async cadastra(cad: CadastroDTO): Promise<CadastroDTO> {
    try {
      return await this.prismaService.user.create({
        data: cad,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Já existe uma conta com esse email');
      }

      this.logger.error('Erro ao criar um usuário', (error as Error).stack);
      throw new BadRequestException('Erro ao criar um usuário');
    }
  }

  async login(log: LoginDTO) {
    this.logger.debug(`Login tentado com: ${JSON.stringify(log)}`);
    return log;
  }
}

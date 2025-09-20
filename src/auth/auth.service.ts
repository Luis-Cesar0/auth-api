import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CadastroDTO, LoginDTO } from './DTOS/auth';
import { Prisma } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async cadastra(cad: CadastroDTO): Promise<{ name: string }> {
    try {
      const hashedPassword = await bcrypt.hash(cad.password, 8);

      const cadastro = await this.prismaService.user.create({
        data: {
          ...cad,
          password: hashedPassword,
        },
      });
      return {
        name: cadastro.name,
      };
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
    const user = await this.prismaService.user.findUnique({
      where: {
        email: log.email,
      },
    });

    try {
      if (!user) throw new UnauthorizedException('Credencias invalidas');

      const passwordMach = await bcrypt.compare(log.password, user.password);

      if (!passwordMach)
        throw new UnauthorizedException('Credencias invalidas');
      const tokenJWT = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      return {
        Token: tokenJWT,
      };
    } catch (error) {
      this.logger.error(`erro ao logar ${error}`);
      throw new UnauthorizedException('Erro no login');
    }
  }
}

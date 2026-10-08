import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import type { CadastroDTO, LoginDTO } from './DTOS/auth';
import type { JwtPayload } from './auth.guard';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async cadastra(cadastro: CadastroDTO): Promise<{ name: string }> {
    try {
      const hashedPassword = await bcrypt.hash(
        cadastro.password,
        BCRYPT_ROUNDS,
      );
      const createdUser = await this.prismaService.user.create({
        data: {
          name: cadastro.name,
          email: cadastro.email,
          password: hashedPassword,
        },
      });

      return { name: createdUser.name };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Já existe uma conta com esse e-mail');
      }

      this.logger.error(
        'Não foi possível cadastrar o usuário',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Não foi possível cadastrar o usuário',
      );
    }
  }

  async login(login: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { email: login.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(login.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}

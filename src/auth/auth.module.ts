import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES_IN, getJwtSecret } from './constants';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: getJwtSecret(),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: JWT_EXPIRES_IN,
        },
        verifyOptions: {
          algorithms: ['HS256'],
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

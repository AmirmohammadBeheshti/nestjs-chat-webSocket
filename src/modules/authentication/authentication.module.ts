import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { PrismaModule } from '../shared/modules/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtSecret } from './constant/jwt-secret.constant';
import { JwtAuthGuard } from './guard/jwt.guard';
import { WsGuard } from './guard/ws.guard';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: JwtSecret,
      signOptions: { expiresIn: '20d' },
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

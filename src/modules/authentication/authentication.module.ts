import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { PrismaModule } from '../shared/modules/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { UserJwtSecretModule } from '../jwt/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { LocalUserStrategy, UserJwtStrategy } from './strategy';
import { userLocalStrategy } from './constant';

@Module({
  imports: [PrismaModule, UserModule, UserJwtSecretModule, PassportModule],
  providers: [AuthenticationService, LocalUserStrategy, UserJwtStrategy],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

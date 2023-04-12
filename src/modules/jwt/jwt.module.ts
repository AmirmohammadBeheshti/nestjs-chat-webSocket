import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserJwtSecret } from './constants/user-jwt.constant';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '20d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: UserJwtSecret,
      useExisting: JwtService,
    },
  ],
  exports: [UserJwtSecret],
})
export class UserJwtSecretModule {}

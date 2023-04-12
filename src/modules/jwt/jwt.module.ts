import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtSecretService } from './constants/jwt.constant';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('USER_JWT_SECRET_KEY'),
        signOptions: { expiresIn: '20d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: JwtSecretService,
      useExisting: JwtService,
    },
  ],
  exports: [JwtSecretService],
})
export class UserJwtSecretModule {}

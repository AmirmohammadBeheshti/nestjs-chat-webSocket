import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { ChatModule } from 'src/modules/chat/chat.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserModule } from '@src/modules/user/user.module';

const configModuleForRoot = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env'],
  cache: true,
  load: [appConfig],
});
@Module({
  imports: [ChatModule, configModuleForRoot, AuthenticationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthenticationModule, UserModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}

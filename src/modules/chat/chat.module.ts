import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';
import { ChatService } from './chat.service';
import { MessagePrismaRepository } from './message.repository';
import { PrismaModule } from '../shared/modules/prisma/prisma.module';

@Module({
  imports: [AuthenticationModule, UserModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, MessagePrismaRepository],
})
export class ChatModule {}

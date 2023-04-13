import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import { GetUser } from '../shared/decorators/get-user.decorator.decorator';
import { IUserJwt } from '../authentication/types';
import { ChatService } from './chat.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get()
  async findAllMessage(@GetUser() user: IUserJwt) {
    return await this.chatService.getAllMessages();
  }
}

import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { JwtSecret } from '../authentication/constant';
import { MessagePrismaRepository } from './message.repository';
@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private messageRepo: MessagePrismaRepository,
  ) {}
  async getUserFromSocket(socket: Socket) {
    const cookie = socket?.handshake?.headers;
    if (!cookie?.authorization) {
      socket._error('ddd');
    }
    const { authorization: authenticationToken } = cookie;
    const verifyToken = await this.authenticationService.verifyJwtToken(
      authenticationToken as string,
      JwtSecret,
    );
    if (!verifyToken) {
      throw new WsException('Invalid credentials.');
    }
    return await this.userService.getOneById(verifyToken.id);
  }
  async saveMessage(content: string, authorId: number) {
    const newMessage = await this.messageRepo.add({
      data: { content, userId: authorId },
    });
    return newMessage;
  }
  async getAllMessages() {
    return this.messageRepo.get({
      include: {
        user: true,
      },
    });
  }
}

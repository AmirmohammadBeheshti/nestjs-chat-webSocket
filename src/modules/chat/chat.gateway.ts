import { Inject, UseFilters } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import appConfig from 'src/app/app.config';
import { ChatService } from './chat.service';
@WebSocketGateway(3001)
export class ChatGateway implements OnGatewayConnection {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
    private readonly chatService: ChatService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, author.id);
    this.server.sockets.emit('receive_message', {
      message,
    });
  }
  @SubscribeMessage('all-message')
  async allMessages(@ConnectedSocket() socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages();
    this.server.sockets.emit('send_all_messages', {
      messages,
    });
  }
}

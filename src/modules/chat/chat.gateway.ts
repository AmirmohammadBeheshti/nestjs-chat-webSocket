import { Inject, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import appConfig from 'src/app/app.config';
import { WsJwtGuard } from '../authentication/guard/ws-jwt.guard';

@WebSocketGateway(3001)
export class ChatGateway {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}
  @WebSocketServer()
  server: Server;

  // @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    this.server.sockets.emit(
      'receive_message',
      this.appConfigs.connectionString,
    );
  }
}

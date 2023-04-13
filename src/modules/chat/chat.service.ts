import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { JwtSecret } from '../authentication/constant';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  async getUserFromSocket(socket: Socket) {
    console.log('Run');
    const cookie = socket?.handshake?.headers;
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
}

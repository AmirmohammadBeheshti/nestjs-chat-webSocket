import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { UserService } from '@src/modules/user/user.service';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtSecret } from '../constant/jwt-secret.constant';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = this.authenticationService.verifyJwtToken(
        bearerToken,
        JwtSecret,
      ) as any;
      return new Promise((resolve, reject) => {
        return this.userService.getOne(decoded.username).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}

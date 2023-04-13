import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { Observable } from 'rxjs';
import { JwtSecret } from '../constant';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private readonly authService: AuthenticationService,
  ) {}

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    const req = context.switchToWs().getData();
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = await this.authService.verifyJwtToken(
        bearerToken,
        JwtSecret,
      );
      if (decoded) {
        return new Promise((resolve, reject) => {
          return this.userService.getOne(decoded.mobileNumber).then((user) => {
            if (user) {
              req.user = user;
              resolve(user);
            } else {
              reject(false);
            }
          });
        });
      } else {
        return false;
      }
    } catch (ex) {
      return false;
    }
  }
}

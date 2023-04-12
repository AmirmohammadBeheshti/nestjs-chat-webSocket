import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import appConfig from 'src/app/app.config';
import { ConfigType } from '@nestjs/config';
import { IUserJwt } from 'src/modules/jwt/types';
// import { UserService } from 'src/modules/role/user/user.service';
import { userJwtStrategy } from '../constant';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(
  Strategy,
  userJwtStrategy,
) {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfigs.jwtSecretKey,
    });
  }

  async validate(payload: IUserJwt) {
    // const user = await this.userService.findOneOrFailed({
    //   _id: payload.id,
    // });
    return 'user';
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtSecret } from '../constant/jwt-secret.constant';
import { UserService } from '@src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecret,
    });
  }

  async validate(payload: any) {
    const id = parseInt(payload.id);
    const user = await this.userService.getOneById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'AsECretKeyF0rGlobalw0s1qWE@!',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub || null,
      username: payload.username || null,
      isAdmin: payload.isAdmin || false,
    };
  }
}

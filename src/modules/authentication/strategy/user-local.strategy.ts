import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { userJwtStrategy } from '../constant';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(
  Strategy,
  userJwtStrategy,
) {
  constructor() {
    super();
  }

  async validate(mobileNumber: string, password: string): Promise<any> {
    // const user = await this.userAuthService.validateUser(
    //   mobileNumber,
    //   password,
    // );

    return 'user';
  }
}

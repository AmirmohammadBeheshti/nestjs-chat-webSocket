import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { userLocalStrategy } from '../constant';
import { UserService } from '@src/modules/user/user.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(
  Strategy,
  userLocalStrategy,
) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(mobileNumber: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(mobileNumber, password);
    console.log('run validate');

    return user;
  }
}

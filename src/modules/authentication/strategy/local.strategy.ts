import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.UserService.validateUser(password, username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password!');
    }
    return user;
  }
}

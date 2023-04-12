import { Injectable, Inject } from '@nestjs/common';
import { RegisterDto } from './dto/request';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { IUserJwt } from './types';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly userJwtService: JwtService,
  ) {}
  async register(register: RegisterDto) {
    const registerObj: Prisma.UserCreateArgs = {
      data: {
        firstName: register.firstName,
        lastName: register.lastName,
        password: register.password,
        mobile: register.mobile,
      },
    };
    const createUser = await this.userService.addUser(registerObj);
    return await this.generateJwtToken({ id: createUser.id.toString() });
  }
  async validateUser(mobileNumber: string, password: string) {
    const user = await this.userService.getOne({ mobileNumber });
    return user;
  }
  async generateJwtToken(userPayload: IUserJwt) {
    return {
      access_token: this.userJwtService.sign(userPayload),
    };
  }
}

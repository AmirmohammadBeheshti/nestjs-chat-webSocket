import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/request';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}
  async register(register: RegisterDto) {
    const registerObj: Prisma.UserCreateArgs = {
      data: {
        firstName: register.firstName,
        lastName: register.lastName,
        password: register.password,
        mobile: register.mobile,
      },
    };
    return await this.userService.addUser(registerObj);
  }
}

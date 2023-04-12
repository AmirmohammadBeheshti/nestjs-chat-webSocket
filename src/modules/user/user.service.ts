import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPrismaRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';
import { hash, verify } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserPrismaRepository) {}
  async addUser(userObj: Prisma.UserCreateArgs) {
    if (userObj.data.password) {
      userObj.data.password = await hash(userObj.data.password);
    }
    return await this.userRepo.add(userObj);
  }
  async validateUser(password: string, mobileNumber: string) {
    const findUser = await this.getOne(mobileNumber);
    if (!findUser) throw new UnauthorizedException();
    if (!this.verifyUserPassword(findUser, password)) {
      throw new UnauthorizedException();
    }
  }

  async getOne(mobileNumber) {
    return await this.userRepo.getOne({ where: { mobile: mobileNumber } });
  }
  async verifyUserPassword(user: User, password: string): Promise<boolean> {
    return verify(user.password, password);
  }
}

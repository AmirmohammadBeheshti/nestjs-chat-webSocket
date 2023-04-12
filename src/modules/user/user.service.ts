import { Injectable } from '@nestjs/common';
import { UserPrismaRepository } from './user.repository';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserPrismaRepository) {}
  async addUser(userObj: Prisma.UserCreateArgs) {
    if (userObj.data.password) {
      userObj.data.password = await hash(userObj.data.password);
    }
    return await this.userRepo.add(userObj);
  }
}

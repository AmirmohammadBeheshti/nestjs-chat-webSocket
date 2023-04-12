import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { BasePrismaRepository } from '../shared/libs/tapsa-repository';

@Injectable()
export class UserPrismaRepository extends BasePrismaRepository<
  User,
  Prisma.UserCreateArgs,
  Prisma.UserCreateManyArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserUpdateManyArgs,
  Prisma.UserFindFirstArgs,
  Prisma.UserFindManyArgs,
  Prisma.UserDeleteArgs,
  Prisma.UserDeleteManyArgs
> {
  constructor(public prismaClient: PrismaClient) {
    super(prismaClient.user, {
      NOT_FOUND: 'کاربر وجود ندارد',
      DUPLICATE: 'کاربر تکراری است',
    });
  }
}

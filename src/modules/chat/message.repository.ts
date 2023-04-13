import { Injectable } from '@nestjs/common';
import { Message, Prisma, PrismaClient } from '@prisma/client';
import { BasePrismaRepository } from '../shared/libs/tapsa-repository';

@Injectable()
export class MessagePrismaRepository extends BasePrismaRepository<
  Message,
  Prisma.MessageCreateArgs,
  Prisma.MessageCreateManyArgs,
  Prisma.MessageUpdateArgs,
  Prisma.MessageUpdateManyArgs,
  Prisma.MessageFindFirstArgs,
  Prisma.MessageFindManyArgs,
  Prisma.MessageDeleteArgs,
  Prisma.MessageDeleteManyArgs
> {
  constructor(public prismaClient: PrismaClient) {
    super(prismaClient.message, {
      NOT_FOUND: 'پیام وجود ندارد',
      DUPLICATE: 'پیام تکراری است',
    });
  }
}

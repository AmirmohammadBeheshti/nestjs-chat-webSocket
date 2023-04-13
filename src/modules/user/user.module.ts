import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../shared/modules/prisma/prisma.module';
import { UserSerializer } from './user.serializer';
import { UserPrismaRepository } from './user.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserPrismaRepository, UserSerializer],
  exports: [UserService, UserSerializer],
})
export class UserModule {}

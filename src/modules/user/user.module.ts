import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserPrismaRepository } from './user.repository';

@Module({
  //   imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserPrismaRepository],
  exports: [UserService],
})
export class UserModule {}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import { GetUser } from '../shared/decorators/get-user.decorator.decorator';
import { IUserJwt } from '../authentication/types';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  @Get()
  findUser(@GetUser() user: IUserJwt) {
    return user;
  }
}

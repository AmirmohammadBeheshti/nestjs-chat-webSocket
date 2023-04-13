import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import { GetUser } from '../shared/decorators/get-user.decorator.decorator';
import { IUserJwt } from '../authentication/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserSerializer } from './user.serializer';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userSerializer: UserSerializer,
    private readonly userService: UserService,
  ) {}
  @Get()
  async findUser(@GetUser() user: IUserJwt) {
    const findUser = await this.userService.getOneById(user.id);
    return this.userSerializer.serialize(findUser);
  }
}

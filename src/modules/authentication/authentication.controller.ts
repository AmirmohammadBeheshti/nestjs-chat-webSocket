import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiTags } from '@nestjs/swagger';
import { UserLocalGuard } from './guard/user-local.guard';
import { LoginDto, RegisterDto } from './dto/request';
import { UserSerializer } from '../user/user.serializer';
import { User } from '@prisma/client';
import { GetUser } from '../shared/decorators/get-user.decorator.decorator';

@ApiTags('User-auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userSerializer: UserSerializer,
  ) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const register = await this.authenticationService.register(registerDto);
    return register;
  }
  @UseGuards(UserLocalGuard)
  @Post('login')
  async login(@GetUser() user: User, @Body() loginDto: LoginDto) {
    return user;
  }
}

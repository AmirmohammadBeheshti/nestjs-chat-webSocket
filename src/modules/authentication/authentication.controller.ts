import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/request';
import { User } from '@prisma/client';
import { GetUser } from '../shared/decorators/get-user.decorator.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('User-auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const register = await this.authenticationService.register(registerDto);
    return register;
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User, @Body() loginDto: LoginDto) {
    console.log(user);
    return this.authenticationService.generateJwtToken({
      id: user.id.toString(),
    });
  }
}

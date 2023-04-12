import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiTags } from '@nestjs/swagger';
import { UserLocalGuard } from './guard/user-local.guard';
import { RegisterDto } from './dto/request';

@ApiTags('User-auth')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authenticationService.register(registerDto);
  }
  @UseGuards(UserLocalGuard)
  @Post('login')
  async login() {
    return 'a';
  }
}

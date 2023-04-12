import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/request';

@Injectable()
export class AuthenticationService {
  async register(register: RegisterDto) {
    return 'a';
  }
}

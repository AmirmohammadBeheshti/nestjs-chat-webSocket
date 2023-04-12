import { AuthGuard } from '@nestjs/passport';
import { userLocalStrategy } from '../constant';

export class UserLocalGuard extends AuthGuard(userLocalStrategy) {}

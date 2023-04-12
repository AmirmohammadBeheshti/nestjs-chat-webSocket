import { User } from '@prisma/client';

export class UserInfoResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: Date;
  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.createdAt = user.createdAt;
  }
}

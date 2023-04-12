import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserInfoResponseDto } from './dto/response';
import { BaseSerializer } from '../shared/libs/tapsa-serializer';
import { Pagination } from '../shared/libs/tapsa-repository/tapsa-repository.type';

@Injectable()
export class UserSerializer extends BaseSerializer<User, UserInfoResponseDto> {
  public async serialize(user: User): Promise<UserInfoResponseDto> {
    return new UserInfoResponseDto(user);
  }

  public async serializePaginated(
    value: Pagination<User>,
  ): Promise<Pagination<UserInfoResponseDto>> {
    const paginated: Pagination<UserInfoResponseDto> =
      new Pagination<UserInfoResponseDto>(
        value.items.map((user) => new UserInfoResponseDto(user)),
        value.meta,
        value.links,
      );

    return paginated;
  }
}

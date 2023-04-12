import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceErrorMessage } from '.';
import { BasePrismaRepository } from '../tapsa-repository';
import { IPaginationOptions } from '../tapsa-repository/tapsa-repository.interface';
import {
  EntityDuplicate,
  EntityNotFound,
  EntityRelationNotFound,
  Pagination,
} from '../tapsa-repository/tapsa-repository.type';

export abstract class BaseService<
  Tentity,
  C,
  CA,
  UO extends { where: Record<string, any> },
  UA extends { where?: Record<string, any> },
  GO extends { where?: Record<string, any> },
  GA extends { where?: Record<string, any> },
  DO extends { where: Record<string, any> },
  DA extends { where?: Record<string, any> },
> {
  constructor(
    public repo: BasePrismaRepository<Tentity, C, CA, UO, UA, GO, GA, DO, DA>,
    public errorMessage: ServiceErrorMessage,
  ) {}

  async add(obj: C): Promise<Tentity> {
    try {
      return await this.repo.add(obj);
    } catch (error) {
      if (error instanceof EntityRelationNotFound) {
        throw new NotFoundException('مجودیت یکی از روابط یافت نشد');
      } else if (error instanceof EntityDuplicate) {
        throw new ConflictException(this.errorMessage.DUPLICATE);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async addBulk(obj: CA): Promise<void> {
    try {
      await this.repo.addBulk(obj);
    } catch (error) {
      if (error instanceof EntityRelationNotFound) {
        throw new NotFoundException('مجودیت یکی از روابط یافت نشد');
      } else if (error instanceof EntityDuplicate) {
        throw new ConflictException(this.errorMessage.DUPLICATE);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async editOne(obj: UO): Promise<Tentity> {
    try {
      return await this.repo.editOne(obj);
    } catch (error) {
      if (error instanceof EntityNotFound) {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      } else if (error instanceof EntityRelationNotFound) {
        throw new NotFoundException('مجودیت یکی از روابط یافت نشد');
      } else if (error instanceof EntityDuplicate) {
        throw new ConflictException(this.errorMessage.DUPLICATE);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async edit(obj: UA): Promise<void> {
    try {
      await this.repo.edit(obj);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      } else if (error instanceof EntityDuplicate) {
        throw new ConflictException(this.errorMessage.DUPLICATE);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getOne(obj: GO): Promise<Tentity> {
    try {
      return await this.repo.getOne(obj);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOneOrFail(obj: GO): Promise<Tentity> {
    try {
      const result = await this.repo.getOneOrFail(obj);

      return result;
    } catch (error) {
      if (error instanceof EntityNotFound) {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async get(obj: GA): Promise<Tentity[]> {
    try {
      return await this.repo.get(obj);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAndPaginate(
    paginationOptions: IPaginationOptions,
    obj: GA,
  ): Promise<Pagination<Tentity>> {
    try {
      return await this.repo.getAndPaginate(paginationOptions, obj);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checkExist(obj: Record<string, any>): Promise<boolean> {
    return this.repo.checkExist(obj);
  }

  async checkExistOrFail(obj: Record<string, any>): Promise<void> {
    try {
      await this.repo.checkExistOrFail(obj);
    } catch (error) {
      if (error instanceof EntityNotFound) {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(
    obj: DA,
    options: { soft: boolean } = { soft: true },
  ): Promise<void> {
    try {
      return await this.repo.remove(obj, options);
    } catch (error) {
      if (error instanceof EntityNotFound) {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async removeOne(
    obj: DO,
    options: { soft: boolean } = { soft: true },
  ): Promise<void> {
    try {
      return await this.repo.removeOne(obj, options);
    } catch (error) {
      if (error instanceof EntityNotFound) {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async recovery(whereObj: Record<string, any>): Promise<void> {
    await this.edit({
      where: whereObj,
      data: { deletedAt: null },
    } as any);
  }
}

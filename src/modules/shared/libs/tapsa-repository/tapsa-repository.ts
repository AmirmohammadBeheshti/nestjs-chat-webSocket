import { Prisma } from '@prisma/client';
import {
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import {
  IPaginationLinks,
  IPaginationOptions,
} from './tapsa-repository.interface';
import {
  EntityDuplicate,
  EntityNotFound,
  EntityRelationNotFound,
  Pagination,
} from './tapsa-repository.type';
import { Id } from '../../types';
import { isNil } from '../../helpers';
import { ServiceErrorMessage } from '../tapsa-crud';

export abstract class BasePrismaRepository<
  Tentity,
  C,
  CA,
  UO extends { where: Record<string, any> },
  UA extends { where?: Record<string, any> },
  GO extends { where?: Record<string, any> },
  GA extends { where?: Record<string, any>; orderBy?: Record<string, any> },
  DO extends { where: Record<string, any> },
  DA extends { where?: Record<string, any> },
> {
  constructor(
    private readonly repo: any,
    private readonly errorMessage: ServiceErrorMessage,
  ) {}

  calculateOffset(take: number, page: number) {
    return take * (page - 1);
  }

  resolveOptions(
    paginationOptions: IPaginationOptions,
  ): [number, number, string] {
    const page = paginationOptions.page;
    const take = paginationOptions.take;
    const route = paginationOptions.route;

    return [page, take, route];
  }

  createPaginationObject<T>(
    items: T[],
    totalItems: number,
    currentPage: number,
    take: number,
    route?: string,
  ): Pagination<T> {
    const totalPages = Math.ceil(totalItems / take);
    const hasFirstPage = route;
    const hasPreviousPage = route && currentPage > 1;
    const hasNextPage = route && currentPage < totalPages;
    const hasLastPage = route;
    const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';
    const routes: IPaginationLinks = {
      first: hasFirstPage ? `${route}${symbol}take=${take}` : '',
      previous: hasPreviousPage
        ? `${route}${symbol}page=${currentPage - 1}&take=${take}`
        : '',
      next: hasNextPage
        ? `${route}${symbol}page=${currentPage + 1}&take=${take}`
        : '',
      last: hasLastPage
        ? `${route}${symbol}page=${totalPages}&take=${take}`
        : '',
    };

    return new Pagination(
      items,
      {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: totalPages,
        currentPage: currentPage,
      },
      routes,
    );
  }

  setDefaultOrder(obj: GA): void {
    if (isNil(obj.orderBy)) {
      obj.orderBy = {
        id: 'asc',
      };
    }
  }

  async paginate(
    repository: any,
    paginationOptions: IPaginationOptions,
    obj: GA,
    options: { excludeDeleted: boolean } = { excludeDeleted: true },
  ): Promise<Pagination<Tentity>> {
    const [page, take, route] = this.resolveOptions(paginationOptions);

    if (page < 1) {
      return this.createPaginationObject([], 0, page, take, route);
    }

    const skip = this.calculateOffset(take, page);
    const totalCount = await this.count({ ...obj.where, deletedAt: null });
    const itemIds =
      totalCount > 0
        ? (
            await repository.findMany({
              select: { id: true },
              where: obj.where ? obj.where : {},
              orderBy: obj.orderBy ? obj.orderBy : {},
              take: take,
              skip: skip,
            })
          ).map((i: { id: Id }) => i.id)
        : [];

    obj.where = { id: { in: itemIds } };
    this.setDefaultOrder(obj);

    const items = itemIds.length > 0 ? await this.get(obj, options) : [];

    return this.createPaginationObject(items, totalCount, page, take, route);
  }

  async add(obj: C): Promise<Tentity> {
    try {
      return await this.repo.create(obj);
    } catch (error) {
      console.log(error);
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        throw new NotFoundException('مجودیت یکی از روابط یافت نشد');
      } else if (
        (error as Prisma.PrismaClientKnownRequestError).code === 'P2002'
      ) {
        throw new ConflictException(this.errorMessage.DUPLICATE);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async addBulk(obj: CA): Promise<Tentity> {
    try {
      return await this.repo.createMany(obj);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
        throw new EntityDuplicate('entity is duplicated');
      } else if (
        (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
      ) {
        throw new EntityRelationNotFound('relation entities not found');
      } else {
        throw error;
      }
    }
  }

  async editOne(obj: UO): Promise<Tentity> {
    try {
      return await this.repo.update(obj);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
        throw new EntityDuplicate('entity is duplicated');
      } else if (
        (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
      ) {
        if (
          (error as Prisma.PrismaClientKnownRequestError).meta['cause'] ===
          'Record to update not found.'
        ) {
          throw new EntityNotFound('entity not found');
        } else {
          throw new EntityRelationNotFound('relation entities not found');
        }
      } else {
        throw error;
      }
    }
  }

  async edit(obj: UA): Promise<void> {
    try {
      return await this.repo.updateMany(obj);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
        throw new EntityDuplicate('entity is duplicated');
      } else if (
        (error as Prisma.PrismaClientKnownRequestError).code === 'P2025'
      ) {
        throw new EntityNotFound('relation entities not found');
      } else {
        throw error;
      }
    }
  }

  async getOne(
    obj: GO,
    options: { excludeDeleted: boolean } = { excludeDeleted: true },
  ): Promise<Tentity> {
    if (options.excludeDeleted) {
      obj = { ...obj, where: { ...obj.where, deletedAt: null } };
    }
    return this.repo.findFirst(obj);
  }

  async getOneOrFail(
    obj: GO,
    options: { excludeDeleted: boolean } = { excludeDeleted: true },
  ): Promise<Tentity> {
    const entity = await this.getOne(obj, options);

    if (!entity) {
      throw new EntityNotFound('entity not found');
    }
    return entity;
  }

  async get(
    obj: GA,
    options: { excludeDeleted: boolean } = { excludeDeleted: true },
  ): Promise<Tentity[]> {
    if (options.excludeDeleted) {
      obj = { ...obj, where: { ...obj.where, deletedAt: null } };
    }
    this.setDefaultOrder(obj);
    return this.repo.findMany(obj);
  }

  async getAndPaginate(
    paginationOptions: IPaginationOptions = { take: 10, page: 1 },
    obj: GA,
    options: { excludeDeleted: boolean } = { excludeDeleted: true },
  ): Promise<Pagination<Tentity>> {
    return this.paginate(this.repo, paginationOptions, obj, options);
  }

  async remove(
    obj: DA,
    options: { soft: boolean } = { soft: true },
  ): Promise<void> {
    if (options.soft) {
      const queryObj = {
        where: obj.where,
        data: { deletedAt: new Date() },
      } as any;

      await this.edit(queryObj);
    } else {
      await this.repo.deleteMany(obj);
    }
  }

  async removeOne(
    obj: DO,
    options: { soft: boolean } = { soft: true },
  ): Promise<void> {
    try {
      if (options.soft) {
        const queryObj = {
          where: obj.where,
          data: { deletedAt: new Date() },
        } as any;

        await this.editOne(queryObj);
      } else {
        await this.repo.delete(obj);
      }
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        throw new EntityNotFound('relation not found');
      } else {
        throw error;
      }
    }
  }

  async recovery(whereObj: Record<string, any>): Promise<void> {
    await this.edit({
      where: whereObj,
      data: { deletedAt: null },
    } as any);
  }

  async count(whereObj: Record<string, any>): Promise<number> {
    return this.repo.count({ where: whereObj });
  }

  async checkExist(whereObj: Record<string, any>): Promise<boolean> {
    const count = await this.count(whereObj);

    if (count > 0) {
      return true;
    }
    return false;
  }

  async checkExistOrFail(whereObj: Record<string, any>): Promise<void> {
    if (!(await this.checkExist(whereObj))) {
      throw new EntityNotFound('entity not found');
    }
  }
}

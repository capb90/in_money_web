import {
  IBaseRepository,
  IFindOptions,
  IPaginationResult,
} from '../interfaces/IBase.repository';
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

export abstract class TypeOrmBaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  protected constructor(private readonly ormRepository: Repository<T>) {}

  public async create(entity: Partial<T>): Promise<T> {
    const responseDb = this.ormRepository.create(entity as DeepPartial<T>);

    return this.ormRepository.save(responseDb);
  }

  public async createMany(entities: Partial<T>[]): Promise<T[]> {
    const responseDb = this.ormRepository.create(entities as DeepPartial<T>[]);
    return this.ormRepository.save(responseDb);
  }

  public async findAll(options?: IFindOptions<T>): Promise<T[]> {
    const findOptionsMap = this.mapToOrmOptions(options);
    return this.ormRepository.find(findOptionsMap);
  }

  public async findById(
    id: string | number,
    options?: IFindOptions<T>,
  ): Promise<T | null> {
    const findOptionsMap = this.mapToOrmOptions(options);
    return this.ormRepository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      ...findOptionsMap,
    });
  }

  public async findBy(where: Partial<T>): Promise<T[]> {
    return this.ormRepository.findBy(where);
  }

  public async findOne(
    where: Partial<T>,
    options?: IFindOptions<T>,
  ): Promise<T | null> {
    const findOptionsMap = this.mapToOrmOptions(options);
    return this.ormRepository.findOne({
      where: where as unknown as FindOptionsWhere<T>,
      ...findOptionsMap,
    });
  }

  public async findWithPagination(
    page: number,
    limit: number,
    options?: IFindOptions<T>,
  ): Promise<IPaginationResult<T>> {
    const skip = (page - 1) * limit;
    const findOptionsMap = this.mapToOrmOptions({
      ...options,
      skip,
      take: limit,
    });

    const [data, total] = await this.ormRepository.findAndCount(findOptionsMap);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async updateBy(
    where: Partial<T>,
    updateData: Partial<T>,
  ): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder()
      .update()
      .set(updateData)
      .where(where)
      .execute();

    return result.affected || 0;
  }

  public async updateById(
    id: string,
    updateData: Partial<T>,
  ): Promise<T | null> {
    const entityToUpdate = await this.ormRepository.preload({
      id,
      ...updateData,
    } as DeepPartial<T> & { id: number | string });

    if (!entityToUpdate) {
      return null;
    }

    return this.ormRepository.save(entityToUpdate);
  }

  public async deleteBy(where: Partial<T>): Promise<number> {
    const result = await this.ormRepository.delete(where);
    return result.affected || 0;
  }

  public async deleteById(id: string | number): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    return (result.affected || 0) > 0;
  }

  public async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.ormRepository.count({
      where: where as unknown as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  public async count(options?: IFindOptions<T>): Promise<number> {
    const findOptions = this.mapToOrmOptions(options);
    return this.ormRepository.count(findOptions);
  }

  public getQueryBuilder(): SelectQueryBuilder<T> {
    return this.ormRepository.createQueryBuilder();
  }

  private mapToOrmOptions(options?: IFindOptions<T>): FindManyOptions<T> {
    if (!options) return {};

    const mappedOptions: FindManyOptions<T> = {};

    if (options.where) {
      mappedOptions.where = options.where as FindOptionsWhere<T>;
    }

    if (options.select) {
      mappedOptions.select = options.select;
    }

    if (options.relations) {
      mappedOptions.relations = options.relations;
    }

    if (options.order) {
      mappedOptions.order = options.order as FindOptionsOrder<T>;
    }

    if (options.skip !== undefined) {
      mappedOptions.skip = options.skip;
    }

    if (options.take !== undefined) {
      mappedOptions.take = options.take;
    }

    return mappedOptions;
  }
}

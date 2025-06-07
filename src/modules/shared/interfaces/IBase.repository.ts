export interface IFindOptions<T> {
  where?: Partial<T>;
  select?: (keyof T)[];
  relations?: string[];
  order?: { [K in keyof T]?: 'ASC' | 'DESC' };
  skip?: number;
  take?: number;
}

export interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<T> {
  create(entity: Partial<T>): Promise<T>;
  createMany(entities: Partial<T>[]): Promise<T[]>;

  findAll(options?: IFindOptions<T>): Promise<T[]>;
  findById(id: string | number, options?: IFindOptions<T>): Promise<T | null>;
  findOne(where: Partial<T>, options?: IFindOptions<T>): Promise<T | null>;
  findBy(where: Partial<T>): Promise<T[]>;

  findWithPagination(
    page: number,
    limit: number,
    options?: IFindOptions<T>,
  ): Promise<IPaginationResult<T>>;

  updateById(id: string | number, updateData: Partial<T>): Promise<T | null>;
  updateBy(where: Partial<T>, updateData: Partial<T>): Promise<number>;

  deleteById(id: string | number): Promise<boolean>;
  deleteBy(where: Partial<T>): Promise<number>;

  count(options?: IFindOptions<T>): Promise<number>;
  exists(where: Partial<T>): Promise<boolean>;

  getQueryBuilder?(): unknown;
}

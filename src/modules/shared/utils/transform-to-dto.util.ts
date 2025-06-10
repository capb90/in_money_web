import { plainToInstance, ClassConstructor } from 'class-transformer';

export function transformToDto<T, V>(dto: ClassConstructor<T>, data: V): T {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}

export function transformArrayToDto<T, V>(
  dto: ClassConstructor<T>,
  data: V[],
): T[] {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}

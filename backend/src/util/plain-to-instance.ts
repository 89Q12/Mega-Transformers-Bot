import { plainToInstance as original } from 'class-transformer';
import { Constructor } from 'type-fest';

export function plainToInstance<T extends object>(
  cls: Constructor<T>,
  plain: Pick<T, keyof T>,
): T {
  return original(cls, plain);
}

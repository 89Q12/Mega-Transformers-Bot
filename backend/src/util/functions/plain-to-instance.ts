import { plainToInstance as original } from 'class-transformer';
import { Constructor } from 'type-fest';

/**
 * Utility function to convert a plain object to the given type and return a constructed class
 * @param cls A class type, must be a constructor
 * @param plain A plain object that can be the cls type
 * @returns the generic T, type of cls
 */
export function plainToInstance<T extends object>(
  cls: Constructor<T>,
  plain: Pick<T, keyof T>,
): T {
  return original(cls, plain);
}

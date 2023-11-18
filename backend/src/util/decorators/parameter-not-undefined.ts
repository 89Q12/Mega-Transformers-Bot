export default function DearV8ProtectMeFromParametersWithNoneValue(
  target: any,
  errorCallback: (context: {
    propertyName: string;
    target: any;
    args: any[];
  }) => void,
): ClassDecorator {
  for (const propertyName of Object.keys(target.prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      propertyName,
    );
    if (!(descriptor.value instanceof Function)) continue;
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      args.forEach((arg) => {
        if (arg === undefined || arg === null) {
          return errorCallback.apply(this, {
            propertyName,
            target,
            args,
          });
        }
      });
      originalMethod.apply(this, args);
    };

    Object.defineProperty(target.prototype, propertyName, descriptor);
  }
  return target;
}

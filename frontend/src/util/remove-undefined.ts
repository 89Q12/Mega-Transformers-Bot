import { clone } from 'rambda';

export const removeUndefined = (obj: object) => {
  const newObj = clone(obj) as any;
  Object.keys(newObj).forEach((key) =>
    newObj[key] === undefined ? delete newObj[key] : {},
  );
  return newObj;
};

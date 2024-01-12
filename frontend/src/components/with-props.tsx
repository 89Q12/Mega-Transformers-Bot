import { ComponentType } from 'react';

// expropriated from https://github.com/VertaAI/modeldb/blob/main/webapp/client/src/shared/utils/react/withProps.tsx
export function withProps<P>(Component: ComponentType<P>) {
  return <F extends Partial<P>>(props: F) =>
    (restProps: Omit<P, Extract<keyof F, keyof P>>) => (
      <Component {...props} {...(restProps as any)} />
    );
}

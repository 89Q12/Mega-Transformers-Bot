import { FC } from 'react';
import { Input } from '@chakra-ui/react';
import { FieldProps } from './with-form-control.tsx';

export const DateField: FC<FieldProps<string>> = ({ helpers, ...field }) => (
  <Input type={'datetime-local'} {...field} />
);

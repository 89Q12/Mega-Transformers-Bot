import { FC } from 'react';
import { Input } from '@chakra-ui/input';
import { FieldProps } from './with-form-control.tsx';

export const DateField: FC<FieldProps<string>> = ({ helpers, ...field }) => (
  <Input type={'datetime-local'} {...field} />
);

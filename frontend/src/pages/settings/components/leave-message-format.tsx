import {
  FieldProps,
  withFormControl,
} from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { Input } from '@chakra-ui/react';
import { FC } from 'react';

const Field: FC<FieldProps<string>> = ({ ...field }) => <Input {...field} />;

export const LeaveMessageFormat = withFormControl<string>(
  Field,
  'leaveMessageFormat' as keyof Settings,
  'Leave Message Format',
);

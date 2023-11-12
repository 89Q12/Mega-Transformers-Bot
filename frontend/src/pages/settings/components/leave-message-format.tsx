import { withFormControl } from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { TextField } from '../../../components/text-field.tsx';

export const LeaveMessageFormat = withFormControl<string>(
  TextField,
  'leaveMessageFormat' as keyof Settings,
  'Leave Message Format',
);

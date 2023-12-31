import { withFormControl } from '../../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { SubmittableTextField } from '../../../../components/submittable-text-field.tsx';

export const LeaveMessageFormat = withFormControl<string>(
  SubmittableTextField,
  'leaveMessageFormat' as keyof Settings,
  'Leave Message Format',
);

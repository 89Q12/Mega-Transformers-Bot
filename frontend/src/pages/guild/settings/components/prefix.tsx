import { withFormControl } from '../../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { SubmittableTextField } from '../../../../components/submittable-text-field.tsx';

export const Prefix = withFormControl<string>(
  SubmittableTextField,
  'prefix' as keyof Settings,
  'Prefix',
);

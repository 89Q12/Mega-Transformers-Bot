import { withFormControl } from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { TextField } from '../../../components/text-field.tsx';

export const Prefix = withFormControl<string>(
  TextField,
  'prefix' as keyof Settings,
  'Prefix',
);

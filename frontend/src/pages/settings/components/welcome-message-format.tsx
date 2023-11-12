import { withFormControl } from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { TextField } from '../../../components/text-field.tsx';

export const WelcomeMessageFormat = withFormControl<string>(
  TextField,
  'welcomeMessageFormat' as keyof Settings,
  'Welcome Message Format',
);

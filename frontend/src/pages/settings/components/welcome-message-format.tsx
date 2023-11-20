import { withFormControl } from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { SubmittableTextField } from '../../../components/submittable-text-field.tsx';

export const WelcomeMessageFormat = withFormControl<string>(
  SubmittableTextField,
  'welcomeMessageFormat' as keyof Settings,
  'Welcome Message Format',
);

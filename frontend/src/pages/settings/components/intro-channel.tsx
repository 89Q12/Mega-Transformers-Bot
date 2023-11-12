import { withFormControl } from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { ChannelField } from './channel-field.tsx';

export const IntroChannel = withFormControl(
  ChannelField,
  'introChannelId' as keyof Settings,
  'Intro Channel',
  'Channel for introductions that only mods and newly joined users may read. Newly joined users can only read this channel for five minutes.',
);

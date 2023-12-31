import { withFormControl } from '../../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { ChannelField } from '../../../../components/channel-field.tsx';

export const OpenIntroChannel = withFormControl(
  ChannelField,
  'openIntroChannelId' as keyof Settings,
  'Open Intro Channel',
  'Channel for introductions that everyone is allowed to read.',
);

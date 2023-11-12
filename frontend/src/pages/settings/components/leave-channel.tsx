import { withFormControl } from '../../../components/with-form-control.tsx';
import { ChannelField } from './channel-field.tsx';
import { Settings } from '../domain/settings.tsx';

export const LeaveChannel = withFormControl(
  ChannelField,
  'leaveChannelId' as keyof Settings,
  'Leave Channel',
  'People leaving the server will be logged in this channel.',
);

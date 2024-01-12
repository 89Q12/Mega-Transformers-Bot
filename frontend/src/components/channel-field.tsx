import { FC } from 'react';
import { FieldProps } from './with-form-control.tsx';
import { Channel } from '../hooks/api/use-get-channels.tsx';
import { Select } from '@chakra-ui/select';

export const ChannelField: FC<FieldProps<string, { channels: Channel[] }>> = ({
  channels,
  helpers: _helpers,
  ...field
}) => (
  <Select {...field}>
    <option key={null} value={undefined}>
      ⸺
    </option>
    {channels.map((channel) => (
      <option key={channel.id} value={channel.id}>
        # {channel.name}
      </option>
    ))}
  </Select>
);

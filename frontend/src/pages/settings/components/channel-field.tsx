import { FC } from 'react';
import { FieldProps } from '../../../components/with-form-control.tsx';
import { Channel } from '../hooks/use-get-channels.tsx';
import { Select } from '@chakra-ui/react';

export const ChannelField: FC<FieldProps<string, { channels: Channel[] }>> = ({
  channels,
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

import { FC } from 'react';
import { DiscordGuildMember } from '../../../../hooks/api/moderation/use-fetch-moderation-users.tsx';
import { AutocompleteField } from '../../../../components/autocomplete-field.tsx';
import { Avatar, Text } from '@chakra-ui/react';

export const SelectMember: FC<{
  value: DiscordGuildMember | null;
  onSelected: (selected: DiscordGuildMember | null) => void;
  members: DiscordGuildMember[];
}> = ({ value, onSelected, members }) => (
  <AutocompleteField<DiscordGuildMember, string>
    value={value}
    items={members}
    onSelect={onSelected}
    itemIdentifier={(member) => member.userId}
    itemText={(member) => member.displayName}
    itemDisplayFactory={(member) => (
      <>
        <Avatar src={member.avatarUrl} />
        <Text as="strong" marginLeft={2}>
          {member.displayName}
        </Text>
        {member.username !== member.displayName && (
          <Text marginLeft={2}>{member.username}</Text>
        )}
      </>
    )}
    itemMatcher={(member, query) =>
      member.displayName.toLowerCase().includes(query.toLowerCase()) ||
      member.username.toLowerCase().includes(query.toLowerCase())
    }
  />
);

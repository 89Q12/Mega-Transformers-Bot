import { Heading } from '@chakra-ui/layout';
import { Button, Grid, Icon } from '@chakra-ui/react';
import { HiClock, HiFire, HiMegaphone, HiUserMinus } from 'react-icons/hi2';
import { FC, useContext, useState } from 'react';
import { GuildSelfContext } from '../../../../state/guild-self.context.tsx';
import { DiscordGuildMember } from '../../../../hooks/api/moderation/use-fetch-moderation-users.tsx';
import { ActionDialogs } from './action-dialogs.tsx';

export const Actions: FC<{ members: DiscordGuildMember[] }> = ({ members }) => {
  const [shownDialog, setShownDialog] = useState<
    'timeout' | 'kick' | 'ban' | 'purge' | undefined
  >(undefined);
  const { self } = useContext(GuildSelfContext);
  const guildName = self?.guildName;

  return (
    <>
      <ActionDialogs
        shownDialog={shownDialog}
        onClose={() => setShownDialog(undefined)}
        members={members}
      />
      <Heading size="md" as="h2">
        Actions
      </Heading>
      <Grid gap={3} gridTemplateColumns="repeat(auto-fit, minmax(25rem, 1fr))">
        <Button
          size="lg"
          leftIcon={<Icon as={HiClock} />}
          onClick={() => setShownDialog('timeout')}
        >
          Timeout a member on {guildName}
        </Button>
        <Button
          size="lg"
          leftIcon={
            <Icon as={HiUserMinus} onClick={() => setShownDialog('kick')} />
          }
          onClick={() => setShownDialog('kick')}
        >
          Kick a member from {guildName}
        </Button>
        <Button
          size="lg"
          leftIcon={<Icon as={HiMegaphone} />}
          onClick={() => setShownDialog('ban')}
        >
          Permantely ban a member from {guildName}
        </Button>
        <Button
          size="lg"
          leftIcon={<Icon as={HiFire} />}
          onClick={() => setShownDialog('purge')}
        >
          Completely purge a member from {guildName}
        </Button>
      </Grid>
    </>
  );
};

import { useBanUser } from '../../../../hooks/api/moderation/use-ban-user.tsx';
import { useTimeoutUser } from '../../../../hooks/api/moderation/use-timeout-user.tsx';
import { usePurgeUser } from '../../../../hooks/api/moderation/use-purge-user.tsx';
import { useKickUser } from '../../../../hooks/api/moderation/use-kick-user.tsx';

export const useModerationActions = () => {
  const timeout = useTimeoutUser();
  const kick = useKickUser();
  const ban = useBanUser();
  const purge = usePurgeUser();
  return { timeout, kick, ban, purge };
};

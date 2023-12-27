import { useParams } from 'react-router-dom';

export const useGuildId = () => {
  const { guildId } = useParams<{ guildId?: string }>();
  return guildId;
};

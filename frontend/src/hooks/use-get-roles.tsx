import { useApi } from './use-api.tsx';
import { useGuildId } from './use-guild-id.tsx';
import { useEffect, useState } from 'react';
import { APIRole } from '../discord-api.ts';

export type Role = APIRole;

export const useGetRoles = () => {
  const api = useApi();
  const guildId = useGuildId();
  const [roles, setRoles] = useState<APIRole[]>();
  useEffect(() => {
    if (!guildId) return;
    api
      .get(`/discord/role/${guildId}/roles`)
      .json<Role[]>()
      .then((roles) => setRoles(roles));
  }, [guildId, api]);

  return roles;
};

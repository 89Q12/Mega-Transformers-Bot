import { useGuildApi } from './use-api.tsx';
import { useEffect, useState } from 'react';
import { APIRole } from '../../discord-api.ts';

export type Role = APIRole;

export const useGetRoles = () => {
  const api = useGuildApi();
  const [roles, setRoles] = useState<APIRole[]>();
  useEffect(() => {
    api
      .get(`/moderation/role/`)
      .json<Role[]>()
      .then((roles) => setRoles(roles));
  }, [api]);

  return roles;
};

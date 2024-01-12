import { Select } from '@chakra-ui/select';
import { FC } from 'react';
import { Role } from '../hooks/api/use-get-roles.tsx';
import { FieldProps } from './with-form-control.tsx';

export const RoleField: FC<FieldProps<string, { roles: Role[] }>> = ({
  roles,
  helpers,
  ...field
}) => (
  <Select {...field}>
    <option key={null} value={undefined}>
      ⸺
    </option>
    {roles.map((role) => (
      <option key={role.id} value={role.id}>
        {role.name}
      </option>
    ))}
  </Select>
);

import { FC } from 'react';
import { FieldProps } from '../../../components/with-form-control.tsx';
import { Role } from '../hooks/use-get-roles.tsx';
import { Select } from '@chakra-ui/react';

export const RoleField: FC<FieldProps<string, { roles: Role[] }>> = ({
  roles,
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

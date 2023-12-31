import { withFormControl } from '../../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { RoleField } from '../../../../components/role-field.tsx';

export const AdminRole = withFormControl(
  RoleField,
  'adminRoleId' as keyof Settings,
  'Admin Role',
  'Role that server admins are assigned to.',
);

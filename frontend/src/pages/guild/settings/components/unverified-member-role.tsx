import { withFormControl } from '../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { RoleField } from '../../../components/role-field.tsx';

export const UnverifiedMemberRole = withFormControl(
  RoleField,
  'unverifiedMemberRoleId' as keyof Settings,
  'Unverified Member Role',
  'Role that new members that are not supposed to access the server yet are assigned.',
);

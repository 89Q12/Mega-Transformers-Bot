import { withFormControl } from '../../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { RoleField } from '../../../../components/role-field.tsx';

export const VerifiedMemberRole = withFormControl(
  RoleField,
  'verifiedMemberRoleId' as keyof Settings,
  'Verified Member Role',
  'Role that members are assigned to after their successful verification.',
);

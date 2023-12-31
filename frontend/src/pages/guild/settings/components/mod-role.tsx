import { withFormControl } from '../../../../components/with-form-control.tsx';
import { Settings } from '../domain/settings.tsx';
import { RoleField } from '../../../../components/role-field.tsx';

export const ModRole = withFormControl(
  RoleField,
  'modRoleId' as keyof Settings,
  'Mod Role',
  'Role that server moderators are assigned to.',
);

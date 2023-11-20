import { FC, useEffect } from 'react';
import { AuditLogFilter } from '../hooks/use-get-audit-logs.tsx';
import { Card, CardBody, Select, Wrap } from '@chakra-ui/react';
import { Form, FormikProvider, useFormik } from 'formik';
import { withFormControl } from '../../../components/with-form-control.tsx';
import { DateField } from '../../../components/date-field.tsx';
import { Action, actions } from '../domain/action.tsx';
import { useSearchParams } from 'react-router-dom';
import { TargetType } from '../domain/target-type.tsx';

const CreatedFrom = withFormControl(
  DateField,
  'createdFrom' as keyof AuditLogFilter,
  'Created (from)',
);

const CreatedTill = withFormControl(
  DateField,
  'createdTill' as keyof AuditLogFilter,
  'Created (until)',
);

const ActionField = withFormControl<string | undefined>(
  ({ helpers: _helpers, ...field }) => (
    <Select {...field}>
      <option key={null} value={undefined}>
        ⸺
      </option>
      {actions.map((action) => (
        <option key={action} value={action}>
          {action}
        </option>
      ))}
    </Select>
  ),
  'action' as keyof AuditLogFilter,
  'Action',
);

export const Filter: FC<{
  onChange: (value: AuditLogFilter) => void;
}> = ({ onChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useFormik<AuditLogFilter>({
    initialValues: {
      createdFrom: searchParams.get('createdFrom') ?? undefined,
      createdTill: searchParams.get('createdTill') ?? undefined,
      actions:
        (searchParams.get('actions') as unknown as Action[]) ?? undefined,
      targetTypes:
        (searchParams.get('targetTypes') as unknown as TargetType[]) ?? [],
    },
    onSubmit: () => {},
  });
  useEffect(() => {
    setSearchParams((searchParams) => ({ ...searchParams, ...form.values }));
    onChange(form.values);
  }, [form.values, onChange]);

  return (
    <FormikProvider value={form}>
      <Card>
        <CardBody>
          <Wrap as={Form}>
            <CreatedFrom />
            <CreatedTill />
            <ActionField />
          </Wrap>
        </CardBody>
      </Card>
    </FormikProvider>
  );
};

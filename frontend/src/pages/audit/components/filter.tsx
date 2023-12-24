import { FC, useEffect } from 'react';
import { AuditLogFilter } from '../hooks/use-get-audit-logs.tsx';
import { Card, CardBody, Select, Wrap, WrapItem } from '@chakra-ui/react';
import { Form, FormikProvider, useFormik } from 'formik';
import { withFormControl } from '../../../components/with-form-control.tsx';
import { DateField } from '../../../components/date-field.tsx';
import { Action, actions } from '../domain/action.tsx';
import { useSearchParams } from 'react-router-dom';
import { TargetType, targetTypes } from '../domain/target-type.tsx';
import { removeUndefined } from '../../../util/remove-undefined.ts';
import { Box } from '@chakra-ui/layout';

const CreatedFrom = withFormControl(
  DateField,
  'createdFrom' satisfies keyof AuditLogFilter,
  'Created (from)',
);

const CreatedTill = withFormControl(
  DateField,
  'createdTill' satisfies keyof AuditLogFilter,
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
  'action' satisfies keyof AuditLogFilter,
  'Action',
);

const TargetTypeField = withFormControl<string | undefined>(
  ({ helpers: _helpers, ...field }) => (
    <Select {...field}>
      <option key={null} value={undefined}>
        ⸺
      </option>
      {targetTypes.map((targetType) => (
        <option key={targetType} value={targetType}>
          {targetType}
        </option>
      ))}
    </Select>
  ),
  'targetType' satisfies keyof AuditLogFilter,
  'Target Type',
);

const FieldWrap: FC = ({ children }) => {};

export const Filter: FC<{
  onChange: (value: AuditLogFilter) => void;
}> = ({ onChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useFormik<AuditLogFilter>({
    initialValues: {
      createdFrom: searchParams.get('createdFrom') ?? undefined,
      createdTill: searchParams.get('createdTill') ?? undefined,
      action: (searchParams.get('actions') as unknown as Action) ?? undefined,
      targetType:
        (searchParams.get('targetType') as unknown as TargetType) ?? [],
    },
    onSubmit: () => {},
  });
  useEffect(() => {
    const values = removeUndefined(form.values);
    setSearchParams((searchParams) => ({ ...searchParams, ...values }));
    onChange(values);
  }, [form.values, onChange]);

  return (
    <FormikProvider value={form}>
      <Card>
        <CardBody>
          <Form>
            <Wrap spacing={4}>
              <WrapItem flex="1 0 15rem">
                <CreatedFrom />
              </WrapItem>
              <WrapItem flex="1 0 15rem">
                <CreatedTill />
              </WrapItem>
            </Wrap>
            <Wrap marginTop={4} spacing={4}>
              <WrapItem flex="1 0 15rem">
                <ActionField />
              </WrapItem>
              <WrapItem flex="1 0 15rem">
                <TargetTypeField />
              </WrapItem>
            </Wrap>
          </Form>
        </CardBody>
      </Card>
    </FormikProvider>
  );
};

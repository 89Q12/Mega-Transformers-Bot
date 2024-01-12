import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control';
import {
  FieldHelperProps,
  FieldInputProps,
  useField,
  useFormikContext,
} from 'formik';
import { ComponentType, ReactNode } from 'react';

export function withFormControl<
  Val,
  Props extends object = Record<string, never>,
>(
  WrappedComponent: ComponentType<FieldProps<Val, Props>>,
  fieldName: string,
  label: ReactNode,
  formHelperText: ReactNode | undefined = undefined,
) {
  return (props: Props) => {
    const { isSubmitting } = useFormikContext();
    const [field, meta, helpers] = useField<Val>(fieldName);
    return (
      <FormControl
        isInvalid={!!meta.error && meta.touched}
        isDisabled={isSubmitting}
      >
        <FormLabel>{label}</FormLabel>
        <WrappedComponent helpers={helpers} {...field} {...props} />
        {formHelperText && <FormHelperText>{formHelperText}</FormHelperText>}
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  };
}

export declare type FieldProps<
  T = any,
  P = Record<string, never>,
> = FieldInputProps<T> & {
  helpers: FieldHelperProps<T>;
} & P;

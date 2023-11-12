import { ComponentType, ReactNode } from 'react';
import { FieldInputProps, useField, useFormikContext } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';

export function withFormControl<Val, Props extends object = {}>(
  WrappedComponent: ComponentType<FieldProps<Val, Props>>,
  fieldName: string,
  label: ReactNode,
  formHelperText: ReactNode | undefined = undefined,
) {
  return (props: Props) => {
    const { isSubmitting } = useFormikContext();
    const [field, meta] = useField<Val>(fieldName);
    return (
      <FormControl
        isInvalid={!!meta.error && meta.touched}
        isDisabled={isSubmitting}
      >
        <FormLabel>{label}</FormLabel>
        <WrappedComponent {...field} {...props} />
        {formHelperText && <FormHelperText>{formHelperText}</FormHelperText>}
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  };
}

export declare type FieldProps<T = any, P = {}> = FieldInputProps<T> & P;

import { IconButton } from '@chakra-ui/button';
import {
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
} from '@chakra-ui/editable';
import { FC, forwardRef, ReactNode, useState } from 'react';
import { HiCheck, HiPencil } from 'react-icons/hi2';
import { FieldProps } from './with-form-control.tsx';

const ControlButton: FC<{ label: string; icon: ReactNode } & any> = forwardRef(
  ({ label, icon, ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        aria-label={label}
        icon={icon}
        size="sm"
        variant="ghost"
        color="currentColor"
        {...props}
      />
    );
  },
);

const Controls = () => {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls();

  if (isEditing) {
    return (
      <ControlButton
        icon={<HiCheck />}
        label="Accept"
        {...getSubmitButtonProps()}
      />
    );
  }
  return (
    <ControlButton
      aria-label="Edit"
      icon={<HiPencil />}
      {...getEditButtonProps()}
    />
  );
};

export const SubmittableTextField: FC<FieldProps<string>> = ({
  helpers,
  ...field
}) => {
  const [value, setValue] = useState(field.value);
  return (
    <Editable
      display="flex"
      borderRadius="var(--chakra-radii-md)"
      border="1px solid"
      borderColor="var(--chakra-colors-whiteAlpha-400)"
      gap={2}
      padding={2}
      value={value}
      onSubmit={() => {
        helpers.setValue(value).then();
        helpers.setTouched(true).then();
      }}
    >
      <EditablePreview
        flex="1 0"
        fontSize="var(--chakra-fontSizes-md)"
        paddingLeft={2}
      />
      <EditableInput
        flex="1 0"
        fontSize="var(--chakra-fontSizes-md)"
        paddingLeft={2}
        disabled={false}
        value={value}
        name={field.name}
        onChange={(e) => setValue(e.target.value)}
        onBlur={field.onBlur}
      />
      <Controls />
    </Editable>
  );
};

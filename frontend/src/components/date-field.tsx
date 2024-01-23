import { Icon } from '@chakra-ui/icon';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { FC, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { HiCalendarDays } from 'react-icons/hi2';
import { useDateTimeFormatter } from '../hooks/ui/use-date-time-formatter.tsx';
import { FieldProps } from './with-form-control.tsx';
import 'react-datepicker/dist/react-datepicker.css';
import './date-field.css';

export const DateField: FC<FieldProps<Date | string | null>> = ({
  helpers,
  ...field
}) => {
  const dateTimeFormatter = useDateTimeFormatter({
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const CustomInput = forwardRef<
    HTMLInputElement,
    { value?: Date | string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <InputGroup>
      <InputLeftElement>
        <Icon as={HiCalendarDays} />
      </InputLeftElement>
      <Input
        value={
          value
            ? dateTimeFormatter.format(
                value instanceof Date ? value : new Date(value),
              )
            : ''
        }
        onClick={onClick}
        isReadOnly
        ref={ref}
      />
    </InputGroup>
  ));
  return (
    <DatePicker
      {...field}
      customInput={<CustomInput />}
      showTimeSelect
      showPopperArrow={false}
      popperPlacement="auto"
      value={
        field.value instanceof Date
          ? field.value.toString()
          : field.value ?? undefined
      }
      onChange={(value) => helpers.setValue(value)}
    />
  );
};

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/number-input';
import { FC } from 'react';

const milliSecondsInAMinute = 60 * 1000;

export const TimeoutDurationField: FC<{
  value: number | null;
  valueChange: (value: number | null) => void;
}> = ({ value, valueChange }) => {
  return (
    <FormControl>
      <FormLabel>Timeout in minutes</FormLabel>
      <NumberInput
        value={value ? value / milliSecondsInAMinute : undefined}
        onChange={(value) =>
          valueChange(Number.parseInt(value) * milliSecondsInAMinute ?? null)
        }
        min={0}
        precision={0}
        step={5}
        w="100%"
      >
        <NumberInputField borderLeftRadius={0} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
};

import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Box } from '@chakra-ui/layout';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/number-input';
import { Select } from '@chakra-ui/select';
import { FC, useCallback, useState } from 'react';

const hoursInADay = 24;
const minutesInAnHour = 60;
const milliSecondsInAMinute = 60 * 1000;
export type Unit = 'minutes' | 'hours' | 'days';

export const TimeoutDurationField: FC<{
  value: number | null;
  valueChange: (value: number | null) => void;
}> = ({ value, valueChange }) => {
  const [input, setInput] = useState<{ value: number | undefined; unit: Unit }>(
    { value: value ?? undefined, unit: 'minutes' },
  );
  const dispatchValueChange = useCallback(
    (input: { value: number | undefined; unit: Unit }) => {
      if (input.value === undefined) return;
      if (input.unit === 'minutes') {
        valueChange(input.value * milliSecondsInAMinute);
      }
      if (input.unit === 'hours') {
        valueChange(input.value * milliSecondsInAMinute * minutesInAnHour);
      }
      if (input.unit === 'days') {
        valueChange(
          input.value * milliSecondsInAMinute * minutesInAnHour * hoursInADay,
        );
      }
    },
    [valueChange],
  );
  const dispatchInputValue = (value: number) =>
    setInput((prev) => {
      const next = { unit: prev.unit, value };
      dispatchValueChange(next);
      return next;
    });
  const dispatchInputUnit = (unit: Unit) =>
    setInput((prev) => {
      const next = { unit, value: prev.value };
      dispatchValueChange(next);
      return next;
    });
  return (
    <FormControl>
      <FormLabel>Timeout</FormLabel>
      <Box display="flex" gap={4}>
        <NumberInput
          value={input.value}
          onChange={(value) => dispatchInputValue(Number.parseInt(value))}
          min={0}
          precision={0}
          step={5}
          w="100%"
          flexGrow={1}
          flexShrink={1}
        >
          <NumberInputField borderLeftRadius={0} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          value={input.unit}
          onChange={(event) => dispatchInputUnit(event.target.value as Unit)}
          width="11rem"
        >
          <option value={'minutes' satisfies Unit}>Minutes</option>
          <option value={'hours' satisfies Unit}>Hours</option>
          <option value={'days' satisfies Unit}>Days</option>
        </Select>
      </Box>
    </FormControl>
  );
};

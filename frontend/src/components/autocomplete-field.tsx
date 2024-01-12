import { IconButton } from '@chakra-ui/button';
import { Icon } from '@chakra-ui/icon';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/popover';
import {
  FC,
  Key,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { HiXMark } from 'react-icons/hi2';

export type AutocompleteProps<T, ID> = {
  items: T[];
  value: T | null;
  onSelect: (value: T | null) => void;
  itemIdentifier: (value: T) => ID;
  itemDisplayFactory: (value: T) => ReactNode;
  itemText: (value: T) => string;
  itemMatcher: (value: T, query: string) => boolean;
  limit?: number;
};

const AutocompleteItem: FC<
  PropsWithChildren<{ highlighted: boolean; onClick: () => void }>
> = ({ highlighted, children, onClick }) => (
  <Box
    onClick={onClick}
    display="flex"
    alignItems="center"
    paddingLeft={4}
    paddingRight={4}
    paddingTop={2}
    paddingBottom={2}
    cursor="pointer"
    backgroundColor={highlighted ? 'primary.300' : ''}
    color={highlighted ? 'black' : ''}
    _hover={{
      backgroundColor: 'primary.200',
      color: 'black',
    }}
  >
    {children}
  </Box>
);

export function AutocompleteField<T, ID extends Key>({
  items,
  itemMatcher,
  limit,
  ...props
}: AutocompleteProps<T, ID>): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const selectValue = (value: T) => {
    props.onSelect(value);
    setTextInput(props.itemText(value));
    setIsOpen(false);
  };
  const clear = () => {
    props.onSelect(null);
    setTextInput('');
    setIsOpen(false);
  };
  const selectableItems = useMemo(() => {
    if (textInput.length === 0) return [];
    return items
      .filter((item) => itemMatcher(item, textInput))
      .slice(0, limit ?? 10);
  }, [textInput, items, itemMatcher, limit]);

  const onKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Escape') {
      if (isOpen) {
        setIsOpen(false);
        props.onSelect(null);
      }
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (highlightedIndex !== null) {
        selectValue(selectableItems[highlightedIndex]);
      }
      return;
    }
    if (event.key === 'ArrowUp') {
      setHighlightedIndex((prev) => {
        const newValue = ((prev ?? 0) - 1) % selectableItems.length;
        return newValue < 0 ? newValue + selectableItems.length : newValue;
      });
      event.preventDefault();
      return;
    }
    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prev) =>
        prev === null ? 0 : (prev + 1) % selectableItems.length,
      );
      event.preventDefault();
      return;
    }
    if (/[a-z|0-9]/i.test(event.key)) {
      setIsOpen(true);
      return;
    }
  };

  return (
    <Popover
      isOpen={isOpen && selectableItems.length > 0}
      placement="bottom"
      lazyBehavior="keepMounted"
      autoFocus={false}
      closeOnBlur={false}
      matchWidth={true}
    >
      <PopoverTrigger>
        <InputGroup>
          <Input
            placeholder="Type to search..."
            onKeyDown={onKeyDown}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            value={textInput}
            onChange={(it) => setTextInput(it.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label="clear"
              variant="ghost"
              icon={<Icon as={HiXMark} />}
              onClick={clear}
              onKeyDown={onKeyDown}
            />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody paddingLeft={0} paddingRight={0}>
          {selectableItems.map((item, i) => (
            <AutocompleteItem
              key={props.itemIdentifier(item)}
              highlighted={
                highlightedIndex !== null &&
                highlightedIndex % selectableItems.length === i
              }
              onClick={() => selectValue(item)}
            >
              {props.itemDisplayFactory(item)}
            </AutocompleteItem>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

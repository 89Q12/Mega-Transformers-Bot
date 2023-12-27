import { Container, Text, useBreakpointValue } from '@chakra-ui/react';
import { useSelf } from '../../hooks/state/use-self.tsx';
import { useCallback, useState } from 'react';
import { AdditionalWrapper } from './additional-wrapper.tsx';

const SelectGuildPage = () => {
  const self = useSelf();
  const [clicked, setClicked] = useState(0);
  const onClick = useCallback(() => setClicked((c) => c + 1), [setClicked]);
  const headerFontSize = useBreakpointValue(
    {
      base: 'xl',
      sm: '3xl',
    },
    { fallback: 'xl' },
  );
  const textFontSize = useBreakpointValue(
    {
      base: 'm',
      sm: 'l',
    },
    { fallback: 'l' },
  );
  return (
    <Container textAlign="center" onClick={onClick}>
      <Text fontSize={headerFontSize} as="p">
        Hi <strong>{self?.name}</strong>! 👋
      </Text>
      <Text fontSize={textFontSize} as="p">
        Select a guild to explore <strong>Mega Transformers Bot</strong>'s
        functionalities.
      </Text>
      <AdditionalWrapper clicked={clicked} fontSize={textFontSize!} />
    </Container>
  );
};
export default SelectGuildPage;

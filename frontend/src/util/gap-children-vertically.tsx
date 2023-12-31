import { css } from '@emotion/react';

export const gapChildrenVertically = (chakraSpace: number) => css`
  & > * + * {
    margin-top: var(--chakra-space-${chakraSpace});
  }
`;

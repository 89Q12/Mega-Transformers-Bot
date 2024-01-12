import { css } from '@emotion/react';

export const gapChildrenVertically = (chakraSpace: number = 4) => css`
  & > * + * {
    margin-top: var(--chakra-space-${chakraSpace});
  }
`;
export const gapChildrenHorizontally = (chakraSpace: number = 4) => css`
  & > * + * {
    margin-left: var(--chakra-space-${chakraSpace});
  }
`;

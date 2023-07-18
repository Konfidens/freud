import React from 'react';

import { styled } from '~/stitches';

const StyledTabs = styled('ul');

type Props = { children: React.ReactNode };

export const Tabs = ({ children }: Props) => (
  <nav>
    <StyledTabs
      css={{
        listStyle: 'none',
        display: 'flex',
        gap: '$6',
        pb: '2px',
      }}
    >
      {children}
    </StyledTabs>
  </nav>
);

import React from 'react';

import {
  StyledCorner,
  StyledRoot,
  StyledScrollbar,
  StyledThumb,
  StyledViewport,
} from './StyledScrollArea';

type RootProps = React.ComponentProps<typeof StyledRoot>;

type Props = {
  children: React.ReactNode;

  type?: RootProps['type'];
  scrollHideDelay?: RootProps['scrollHideDelay'];
  css?: RootProps['css'];
};

export const ScrollArea = ({ children, type, scrollHideDelay, css }: Props) => (
  <StyledRoot type={type} scrollHideDelay={scrollHideDelay} css={css}>
    <StyledViewport css={{ backgroundColor: 'white' }}>
      {children}
    </StyledViewport>
    <StyledScrollbar orientation="vertical">
      <StyledThumb />
    </StyledScrollbar>
    <StyledScrollbar orientation="horizontal">
      <StyledThumb />
    </StyledScrollbar>
    <StyledCorner />
  </StyledRoot>
);

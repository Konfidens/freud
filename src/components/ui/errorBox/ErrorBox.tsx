import React from 'react';

import { styled } from '~/stitches';
import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';

type StyledErrorBoxProps = React.ComponentProps<typeof StyledErrorBox>;

type Props = StyledErrorBoxProps & {
  children: React.ReactNode;
  show?: boolean;
};

const StyledErrorBox = styled('div', {
  fontWeight: '500',
  color: 'white',
  bg: '$red600',
  borderRadius: '$lg',
  transition: 'all 0.1s ease-in',
  opacity: 0,
  maxHeight: 0,
  overflow: 'auto',

  variants: {
    show: {
      true: {
        transition: 'all 0.1s ease-in',
        opacity: 1,
        maxHeight: '$80', // This is brittle, but I haven't found a better way to animate variable height
        mt: '$2',
      },
      false: {
        transition: 'all 0.1s ease-out',
      },
    },
  },

  defaultVariants: {
    show: 'true',
  },
});

export const ErrorBox = React.forwardRef(
  (
    { children, show = true, ...rest }: Props,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <StyledErrorBox show={show} ref={ref} {...rest}>
        <Div css={{ display: 'flex', py: '$4', px: '$5' }}>
          <Div
            css={{
              flexShrink: '0',
              position: 'relative',
              top: 1,
              mr: '$4',
              color: '$red200',
            }}
          >
            <Icon name="exclamation" size="1.5em" />
          </Div>
          <div>{children}</div>
        </Div>
      </StyledErrorBox>
    );
  },
);

ErrorBox.displayName = 'ErrorBox';

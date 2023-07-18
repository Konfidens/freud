import React from 'react';

import { CSS, styled } from '~/stitches';
import { Icon } from '../icon/Icon';
import { iconClassName } from '../icon/constants';

type StyledErrorMessageProps = React.ComponentProps<typeof StyledErrorMessage>;

type Props = StyledErrorMessageProps & {
  children: React.ReactNode;
  show?: boolean;
  iconCss?: CSS;
};

const StyledErrorMessage = styled('div', {
  fontSize: '$s',
  fontWeight: '500',
  display: 'flex',
  transition: 'all .1s ease-in',
  opacity: 0,
  maxHeight: 0,

  variants: {
    show: {
      true: {
        opacity: 1,
        maxHeight: 'unset',
        mt: '$2',
      },
      false: {},
    },
    variant: {
      error: {
        color: '$red400',
      },
      warning: {
        color: '$yellow600',

        [`& .${iconClassName}`]: {
          color: '$yellow450',
        },
      },
    },
  },
  defaultVariants: {
    show: 'true',
    variant: 'error',
  },
});

const StyledIconDiv = styled('div', {
  color: '$red400',
  fontSize: '$l',
  mr: '$2',
  flexShrink: '0',
  position: 'relative',
  top: '2px',
  variants: {
    show: {
      // Instantly hide icon when show is false
      // Since react-hook-form removes the text, the
      // collapse animation looked a bit janky
      true: { display: 'block' },
      false: { display: 'none', pointerEvents: 'none' },
    },
    variant: {
      error: {
        [`& .${iconClassName}`]: {
          color: '$red400 !important',
        },
      },
      warning: {
        [`& .${iconClassName}`]: {
          color: '$yellow450 !important',
        },
      },
    },
  },
  defaultVariants: {
    show: 'true',
  },
});

export const ErrorMessage = React.forwardRef(
  (
    { children, iconCss, show, variant, ...rest }: Props,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <StyledErrorMessage show={show} variant={variant} ref={ref} {...rest}>
        <StyledIconDiv
          show={show}
          variant={variant}
          css={{
            ...iconCss,
          }}
        >
          <Icon name="exclamationSolid" />
        </StyledIconDiv>
        {children}
      </StyledErrorMessage>
    );
  },
);
ErrorMessage.displayName = 'ErrorMessage';

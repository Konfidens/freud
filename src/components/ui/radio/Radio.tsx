import * as RadixRadio from '@radix-ui/react-radio-group';
import React from 'react';

import { CSS } from '~/stitches';
import { Div } from '../basic/Div';

import { StyledRadio } from './StyledRadio';

export type RadioProps = {
  value: string;
  disabled?: boolean;
  required?: boolean;
  asChild?: boolean;
  size?: 'small' | 'medium';
  id?: string;
  css?: CSS;
};

export const Radio = React.forwardRef(
  (
    { css, ...rest }: RadioProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <Div css={{ position: 'relative', ...css }}>
      <StyledRadio ref={ref} {...rest}>
        <RadixRadio.Indicator />
      </StyledRadio>
    </Div>
  ),
);
Radio.displayName = 'Radio';

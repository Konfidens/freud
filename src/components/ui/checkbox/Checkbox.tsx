import * as RadixCheckbox from '@radix-ui/react-checkbox';
import React from 'react';

import { CSS } from '~/stitches';
import { Div } from '../basic/Div';

import { AnimatedCheckmark } from './AnimatedCheckmark';
import { IconWrap, StyledCheckbox } from './StyledCheckbox';

export type CheckboxProps = {
  size?: 'small' | 'medium';
  css?: CSS;
  disabled?: boolean;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  onBlur?: () => void;
  required?: boolean;
  value?: string;
};

export const Checkbox = React.forwardRef(
  (
    { size = 'medium', css, ...rest }: CheckboxProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <Div css={{ position: 'relative', ...css }}>
      <StyledCheckbox ref={ref} size={size} {...rest}>
        <RadixCheckbox.Indicator>
          <IconWrap size={size}>
            <AnimatedCheckmark />
          </IconWrap>
        </RadixCheckbox.Indicator>
      </StyledCheckbox>
    </Div>
  ),
);

Checkbox.displayName = 'Checkbox';

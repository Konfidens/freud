import React from 'react';

import { CSS } from '~/stitches';
import { Div } from '../basic/Div';

import { StyledSwitch, StyledThumb } from './StyledSwitch';

export type SwitchProps = {
  'aria-label'?: string;
  'aria-describedby'?: string;
  size?: 'small' | 'medium' | 'large';
  id?: string;
  name?: string;
  value?: string;
  css?: CSS;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  disabled?: boolean;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
};

export const Switch = React.forwardRef(
  (
    { size, css, ...rest }: SwitchProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <Div css={{ position: 'relative', ...css }}>
      <StyledSwitch ref={ref} size={size} {...rest}>
        <StyledThumb size={size} />
      </StyledSwitch>
    </Div>
  ),
);

Switch.displayName = 'Switch';

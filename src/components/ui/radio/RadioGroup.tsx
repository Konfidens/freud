import React from 'react';

import { CSS } from '~/stitches';

import { StyledRadioGroup } from './StyledRadioGroup';

export type RadioGroupProps = {
  css?: CSS;
  disabled?: boolean;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  loop?: boolean;
  children?: React.ReactNode;
};

export const RadioGroup = React.forwardRef(
  ({ ...rest }: RadioGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => (
    <StyledRadioGroup ref={ref} {...rest} />
  ),
);

RadioGroup.displayName = 'RadioGroup';

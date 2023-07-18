import { PropertyValue } from '@stitches/react';
import React from 'react';
import { LiteralUnion } from '~/types/literalUnion';



import { InputAddon } from './InputAddon';
import { InputWrap as Wrap } from './InputWrap';
import { StyledInput } from './StyledInput';

type StyledInputProps = React.ComponentProps<typeof StyledInput>;

export type InputProps = Omit<
  StyledInputProps,
  'type' | 'prefix' | 'suffix'
> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  prefixStyle?: 'none' | 'border' | 'borderless' | 'button';
  suffixStyle?: 'none' | 'border' | 'borderless' | 'button';
  type?:
  | 'text'
  | 'password'
  | 'tel'
  | 'email'
  | 'integer'
  | 'date'
  | 'datetime-local';
  width?: LiteralUnion<PropertyValue<'width'>, string>;
};

export const Input = React.forwardRef(
  (
    {
      prefix,
      suffix,
      prefixStyle = 'borderless',
      suffixStyle = 'borderless',
      size,
      type,
      error,
      width,
      css,
      ...rest
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <Wrap
        css={{
          width: width || '$64',
          ...css,
        }}
        size={size}
      >
        {prefix && (
          <InputAddon side="prefix" addonStyle={prefixStyle} size={size}>
            {prefix}
          </InputAddon>
        )}
        <StyledInput
          prefixStyle={prefix ? prefixStyle : 'none'}
          suffixStyle={suffix ? suffixStyle : 'none'}
          prefix={!!prefix}
          suffix={!!suffix}
          type={type === 'integer' ? 'text' : type}
          inputMode={type === 'integer' ? 'numeric' : undefined}
          pattern={type === 'integer' ? '[0-9]*' : undefined}
          size={size}
          error={error}
          aria-invalid={error ? 'true' : undefined}
          {...rest}
          ref={ref}
        />

        {suffix && (
          <InputAddon side="suffix" addonStyle={suffixStyle} size={size}>
            {suffix}
          </InputAddon>
        )}
      </Wrap>
    );
  },
);
Input.displayName = 'Input';

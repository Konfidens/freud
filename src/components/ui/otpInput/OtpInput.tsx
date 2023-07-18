import React from 'react';

import { HiddenInput } from './HiddenInput';
import { OtpDigits } from './OtpDigits';
import { OtpWrap } from './OtpWrap';

type HiddenInputProps = React.ComponentProps<typeof HiddenInput>;

type Props = HiddenInputProps & {
  numDigits: number;
  value: string;
};

export const OtpInput = React.forwardRef(
  (
    { numDigits, value, height = '5.2rem', ...rest }: Props,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <OtpWrap>
        {/* An invisible HTML input field  */}
        <HiddenInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={numDigits}
          css={{ height }}
          {...rest}
          ref={ref}
        />

        {/* Displayed directly on top of HiddenInput. Looks like inputs, but is in reality
          just a bunch of divs. Ignores clicks and instead sends them to the hidden input beneath.
       */}
        <OtpDigits value={value} numDigits={numDigits} />
      </OtpWrap>
    );
  },
);

OtpInput.displayName = 'OtpInput';

import { styled } from '~/stitches';
import { Div } from '../basic/Div';

import { OtpWrap } from './OtpWrap';

const DigitInput = styled('div', {
  // Take as much room as possible
  width: '100%',
  height: '100%',

  // Center the contents
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  // Supersize it!
  fontSize: '$3xl',
  fontWeight: '500',

  background: 'white',
  boxShadow: '$border',

  '&:first-child': {
    borderLeftRadius: '$lg',
  },

  '&:last-child': {
    borderRightRadius: '$lg',
  },

  // Focus on the first "digit box" that's empty.
  [`
    ${OtpWrap}:focus-within &:empty:first-of-type,
    ${OtpWrap}:focus-within &:not(:empty) + &:empty,
    ${OtpWrap}:focus-within &:not(:empty) + &:last-of-type
  `]: {
    boxShadow: '$focusRingInput',
    zIndex: 1,
  },
});

type Props = {
  value: string;
  numDigits: number;
};

export const OtpDigits = ({ value, numDigits }: Props) => {
  const digitArray = value ? Array.from(value) : [];
  return (
    <Div
      css={{
        // Display the digits in a row
        display: 'flex',

        // Cover the input field completely
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

        // Make mouse clicks go straight through to the input field
        pointerEvents: 'none',
      }}
    >
      {[...Array(numDigits)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <DigitInput key={`otp-digit-${i}`}>{digitArray[i]}</DigitInput>
      ))}
    </Div>
  );
};

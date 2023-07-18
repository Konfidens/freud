import { styled } from '~/stitches';

export const Label = styled('label', {
  fontWeight: '500',
  fontSize: '$m',
  lineHeight: '$normal',

  variants: {
    disabled: {
      false: {
        color: '$textBody',
        cursor: 'pointer',
      },
      true: {
        color: '$gray400',
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: {
    disabled: 'false',
  },
});

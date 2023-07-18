import { styled } from '~/stitches';

export const StyledInput = styled('input', {
  appearance: 'none',
  outline: 'none',
  border: 'none',
  transition: 'all 80ms linear',
  width: '100%',
  borderRadius: '$lg',
  color: '$textHeading',
  backgroundColor: 'white',

  '&::placeholder': {
    opacity: 1, // Firefox fix
    color: '$gray400',
  },

  '&:disabled, &[aria-disabled="true"]': {
    cursor: 'not-allowed',
    backgroundColor: '$gray100',
  },

  variants: {
    error: {
      false: {
        boxShadow: '$border, $small',

        '&:not(:disabled):not([aria-disabled="true"])': {
          '&:hover': {
            boxShadow: '$borderHover, $small',
          },

          '&:focus': {
            zIndex: 1,
            boxShadow: '$focusRingInput, $small',
          },
        },
      },
      true: {
        boxShadow: '$borderError, $small',

        '&:not(:disabled):not([aria-disabled="true"])': {
          '&:focus': {
            zIndex: 1,
            boxShadow: '$focusRingInput, $small',
          },
        },
      },
    },
    size: {
      medium: {
        fontSize: '$m',
        lineHeight: '$6',
        py: '$2',
        px: '$3',
      },
      large: {
        fontSize: '$l',
        lineHeight: '$6',
        py: '$3',
        px: '$4',
      },
    },
    prefixStyle: {
      none: {},
      button: {},
      border: {
        borderLeftRadius: 0,
      },
      borderless: {},
    },
    suffixStyle: {
      none: {},
      button: {},
      border: {
        borderRightRadius: 0,
      },
      borderless: {},
    },
    prefix: {
      true: {},
      false: {},
    },
    suffix: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      size: 'medium',
      prefixStyle: 'borderless',
      css: {
        pl: '$12',
      },
    },
    {
      size: 'medium',
      suffixStyle: 'borderless',
      css: {
        pr: '$12',
      },
    },
    {
      size: 'large',
      prefixStyle: 'borderless',
      css: {
        pl: 'calc($12 + $2)',
      },
    },
    {
      size: 'large',
      suffixStyle: 'borderless',
      css: {
        pr: 'calc($12 + $2)',
      },
    },
    {
      prefixStyle: 'button',
      prefix: true,
      css: {
        borderLeftRadius: 0,
      },
    },
    {
      suffixStyle: 'button',
      suffix: true,
      css: {
        borderRightRadius: 0,
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    prefixStyle: 'none',
    suffixStyle: 'none',
    error: false,
  },
});

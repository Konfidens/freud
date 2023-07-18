import { styled } from '~/stitches';

export const StyledTextArea = styled('textarea', {
  appearance: 'none',
  outline: 'none',
  border: 'none',
  transition: 'box-shadow 80ms linear, color 80ms linear',
  width: '100%',
  borderRadius: '$lg',
  color: '$textHeading',
  backgroundColor: 'white',
  fontSize: '$m',
  lineHeight: '$6',
  py: '$2',
  px: '$3',
  boxShadow: '$border, $small',

  '&:not(:disabled)': {
    '&:hover': {
      boxShadow: '$borderHover, $small',
    },

    '&:focus': {
      zIndex: 1,
      boxShadow: '$focusRingInput, $small',
    },
  },

  '&::placeholder': {
    opacity: 1, // Firefox fix
    color: '$gray400',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    backgroundColor: '$gray100',
  },

  variants: {
    resize: {
      none: { resize: 'none' },
      vertical: { resize: 'vertical' },
      horizontal: { resize: 'horizontal' },
      both: { resize: 'both' },
    },
  },

  defaultVariants: {
    resize: 'vertical',
  },
});

import { styled } from '~/stitches';

export const StyledItem = styled('a', {
  display: 'flex',
  gap: '$3',
  p: '$3',
  borderRadius: '$lg',
  textDecoration: 'none',
  alignItems: 'center',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  minWidth: '$12',

  '&:focus-visible': {
    boxShadow: '$focusRingWithLightOffset',
  },

  variants: {
    variant: {
      green: {},
      gray: {},
    },
    active: {
      true: {
        color: '$textHeading',
      },
      false: {
        bg: 'transparent',
        color: '$textBody',
      },
    },
  },
  compoundVariants: [
    {
      active: 'true',
      variant: 'gray',
      css: {
        bg: '$gray100',
      },
    },
    {
      active: 'true',
      variant: 'green',
      css: {
        bg: '$green50',
      },
    },
    {
      active: 'false',
      variant: 'gray',
      css: {
        '&:hover': {
          bg: '$gray100',
        },
      },
    },
    {
      active: 'false',
      variant: 'green',
      css: {
        '&:hover': {
          bg: '$gray50',
        },
      },
    },
  ],
  defaultVariants: {
    active: 'false',
    variant: 'green',
  },
});

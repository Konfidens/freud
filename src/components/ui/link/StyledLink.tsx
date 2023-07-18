import { styled } from '~/stitches';
import { iconClassName } from '../icon/constants';

export const StyledLink = styled('a', {
  color: '$textHeading',
  fontWeight: '500',
  fontSize: 'inherit',
  outline: 'none',
  textDecoration: 'none',
  transition: 'all .1s',

  [`& .${iconClassName}`]: {
    fontSize: '$sizes$5',
    strokeWidth: '2',
  },

  variants: {
    variant: {
      greenUnderline: {
        boxShadow: 'inset 0 -0.2em 0 $colors$green200', // The underline
        pb: '0.125em', // Bump the underline further down

        '&:hover, &:focus-visible ': {
          boxShadow: 'inset 0 -1.5em 0 $colors$green100',
        },
      },
      green: {
        color: '$green475',
        pb: '0.125em', // Bump the underline further down

        '&:hover, &:focus-visible ': {
          boxShadow: 'inset 0 -0.1em 0 currentColor',
        },
      },
      blue: {
        color: '$blue600',
        pb: '0.125em', // Bump the underline further down

        '&:hover, &:focus-visible ': {
          boxShadow: 'inset 0 -0.1em 0 currentColor',
        },
      },
      lightBlue: {
        color: '$blue400',
        pb: '0.125em', // Bump the underline further down

        '&:hover, &:focus-visible ': {
          boxShadow: 'inset 0 -0.1em 0 currentColor',
        },
      },
      black: {
        color: '$textHeading',
        fontWeight: '700',
        pb: '0.125em', // Bump the underline further down

        '&:hover, &:focus-visible ': {
          boxShadow: 'inset 0 -0.1em 0 currentColor',
        },
      },
      block: {
        display: 'inline-block',

        '&:focus-visible': {
          boxShadow: '$focusRingWithLightOffset',
        },
      },
    },
    asButton: {
      true: {
        border: 'none',
        bg: 'transparent',
        cursor: 'pointer',
        lineHeight: 'initial',
      },
      false: {},
    },
    withAddon: {
      true: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '$1',
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'greenUnderline',
    asButton: 'false',
    withAddon: 'false',
  },
});

import * as RadixCheckbox from '@radix-ui/react-checkbox';

import { keyframes, styled } from '~/stitches';

const shrink = keyframes({
  '50%': { transform: 'scale(.9)' },
});

export const StyledCheckbox = styled(RadixCheckbox.Root, {
  outline: 'none',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '$md',
  backgroundColor: 'white',
  border: '1px solid $colors$gray350',
  boxShadow: '$small',
  transition: 'all 150ms ease, box-shadow 60ms linear',
  transform: 'scale(1)', // Shrink animation
  willChange: 'transform',

  // Pulse animation
  '&:before': {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: '-1',
    content: '',
    width: '100%',
    height: '100%',
    bg: '$green500',
    display: 'block',
    transform: 'scale(0)',
    opacity: '0.5',
    borderRadius: '50%',
  },

  '&[data-state="checked"]': {
    bg: '$green500',
    borderColor: 'transparent',
    animation: `${shrink} 300ms ease`, // Shrink animation

    // Pulse animation
    '&:before': {
      transform: 'scale(3.5)',
      opacity: 0,
      transition: 'all 500ms ease',
    },
  },

  '&:not(:disabled)': {
    '&:hover': {
      borderColor: '$gray500',

      '&[data-state="checked"]': {
        borderColor: 'transparent',
      },
    },

    '&:focus-visible': {
      boxShadow: '$small, $focusRingWithLightOffset',
    },
  },

  '&:disabled': {
    cursor: 'not-allowed',
    bg: '$gray100',

    '&[data-state="checked"]': {
      bg: '$gray300',
    },
  },

  variants: {
    size: {
      small: {
        size: '$5',
      },
      medium: {
        size: '$6',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const IconWrap = styled('span', {
  color: 'white',

  variants: {
    size: {
      small: {
        fontSize: '$sizes$4',
      },
      medium: {
        fontSize: '$sizes$5',
      },
    },
  },
});

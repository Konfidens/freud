import * as RadixRadioGroup from '@radix-ui/react-radio-group';

import { styled } from '~/stitches';

export const StyledRadio = styled(RadixRadioGroup.Item, {
  $$borderWidth: '1px',
  $$borderColor: '$colors$gray350',
  $$border: 'inset 0 0 0 $$borderWidth $$borderColor',

  position: 'relative',
  outline: 'none',
  border: 'none',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '$full',
  bg: 'white',
  boxShadow: '$small, $$border',
  transition: 'all 150ms ease, box-shadow 80ms linear',
  transformStyle: 'preserve-3d',

  // Pulse animation
  '&:before': {
    pointerEvents: 'none',
    position: 'absolute',
    content: '',
    width: '100%',
    height: '100%',
    bg: 'transparent',
    display: 'block',
    transform: 'scale(0.8) translateZ(-1px)',
    opacity: '0.3',
    transition: 'all 500ms ease',
    transitionProperty: 'transform, opacity',
    borderRadius: '$full',
  },

  '&[data-state="checked"]': {
    $$borderColor: '$colors$green500',

    // Pulse animation
    '&:before': {
      bg: '$green500',
      transform: 'scale(3.2) translateZ(-1px)',
      opacity: 0,
    },
  },

  '&:not(:disabled)': {
    '&:hover:not([data-state="checked"])': {
      $$borderColor: '$colors$gray500',
    },

    '&:focus-visible': {
      boxShadow: '$small, $$border, $focusRingWithLightOffset',
    },
  },

  '&:disabled': {
    cursor: 'not-allowed',
    bg: '$gray100',

    '&[data-state="checked"]': {
      bg: 'white',
      $$borderColor: '$colors$gray300',
    },
  },

  variants: {
    size: {
      small: {
        size: '$5',
        '&[data-state="checked"]': {
          $$borderWidth: '6.5px',
        },
      },
      medium: {
        size: '$6',
        '&[data-state="checked"]': {
          $$borderWidth: '8px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

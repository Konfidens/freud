import * as RadixSwitch from '@radix-ui/react-switch';

import { styled } from '~/stitches';

const TRANSITION_SPEED = '100ms';
const THUMB_PADDING = '2px';

export const StyledSwitch = styled(RadixSwitch.Root, {
  all: 'unset',
  position: 'relative',
  borderRadius: '$full',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:focus-visible': { boxShadow: '$focusRingWithLightOffset' },
  transition: `background-color ${TRANSITION_SPEED}`,

  '&:not(:disabled)': {
    cursor: 'pointer',
    bg: '$gray300',
    '&[data-state="checked"]': { bg: '$green450' },
  },

  '&:disabled': {
    cursor: 'not-allowed',
    bg: '$gray200',
    '&[data-state="checked"]': { bg: '$green200' },
  },

  variants: {
    size: {
      small: {
        height: '$5',
        width: `calc(($5 - ${THUMB_PADDING}) * 2)`,
      },
      medium: {
        height: '$6',
        width: `calc(($6 - ${THUMB_PADDING}) * 2)`,
      },
      large: {
        height: '28px',
        width: `calc((28px - ${THUMB_PADDING}) * 2)`,
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const StyledThumb = styled(RadixSwitch.Thumb, {
  display: 'block',
  borderRadius: '$full',
  boxShadow: `0 2px 3px -1px rgb(0 0 0 / 0.2)`, // TODO: Consider extracting
  transition: `transform ${TRANSITION_SPEED}`,
  willChange: 'transform',

  ':not(disabled) &': {
    bg: 'white',
  },

  ':disabled &': {
    bg: '$gray50',
  },

  variants: {
    size: {
      small: {
        transform: `translateX(${THUMB_PADDING})`,
        size: `calc($5 - (${THUMB_PADDING} * 2))`,
        '&[data-state="checked"]': { transform: 'translateX(18px)' }, // $5 - THUMB_PADDING
      },
      medium: {
        transform: `translateX(${THUMB_PADDING})`,
        size: `calc($6 - (${THUMB_PADDING} * 2))`,
        '&[data-state="checked"]': { transform: 'translateX(22px)' }, // $6 - THUMB_PADDING
      },
      large: {
        transform: `translateX(${THUMB_PADDING})`,
        size: `calc(28px - (${THUMB_PADDING} * 2))`,
        '&[data-state="checked"]': { transform: 'translateX(26px)' }, // 28px - THUMB_PADDING
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

import * as RadixPopover from '@radix-ui/react-popover';

import { keyframes, styled } from '~/stitches';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

export const StyledPopoverContent = styled(RadixPopover.Content, {
  borderRadius: '$lg',
  padding: '$4',
  backgroundColor: 'white',
  boxShadow: '$medium',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideUpAndFade },
      '&[data-side="right"]': { animationName: slideRightAndFade },
      '&[data-side="bottom"]': { animationName: slideDownAndFade },
      '&[data-side="left"]': { animationName: slideLeftAndFade },
    },
  },
});

export const StyledPopoverArrow = styled(RadixPopover.Arrow, {
  fill: 'white',
});

export const StyledPopoverClose = styled(RadixPopover.Close, {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '$full',
  height: '$6',
  width: '$6',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '$2',
  right: '$2',
  cursor: 'pointer',
  color: '$gray500',

  '&:hover': { backgroundColor: '$gray100' },
  '&:focus-visible': { boxShadow: '$focusRingWithLightOffset' },
});

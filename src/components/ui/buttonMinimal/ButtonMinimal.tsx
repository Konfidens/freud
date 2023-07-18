import { styled } from '../../../stitches';

// A button with minimal styling.
// Useful as a starting point for custom button components
export const ButtonMinimal = styled('button', {
  border: 0,
  textDecoration: 'none',
  transition: 'all 80ms linear, transform 60ms linear',
  outline: 'none',
  willChange: 'transform',
  bg: 'transparent',
  borderRadius: '$sm',
  height: 'auto',

  '&:focus-visible': {
    boxShadow: '$focusRing',
    // Make sure outline is display on top of sibling buttons
    zIndex: '1',
  },

  '&:not(:disabled)': {
    cursor: 'pointer',
  },

  '&:disabled': {
    cursor: 'not-allowed',
  },
});

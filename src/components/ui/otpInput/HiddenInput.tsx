import { styled } from '~/stitches';

export const HiddenInput = styled('input', {
  // Set the width and height of the input
  fontSize: '$3xl',
  width: '100%',

  // Make the input hide in plainsight
  appearance: 'none',
  border: 'none',
  color: 'transparent',
  caretColor: 'transparent',
  backgroundColor: 'transparent',
  outline: 'none',
  opacity: '0.05', // Minimum threshold to make it visible to screenreaders
});

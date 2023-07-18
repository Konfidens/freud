import { styled } from '~/stitches';

import { headingSizeVariant } from './utils';

export const H6 = styled('h6', {
  color: '$textHeading',
  fontWeight: '500',

  variants: {
    size: headingSizeVariant,
  },

  defaultVariants: {
    size: 'xs',
  },
});

import { styled } from '~/stitches';

import { headingSizeVariant } from './utils';

export const H1 = styled('h1', {
  color: '$textHeading',
  fontWeight: '500',

  variants: {
    size: headingSizeVariant,
  },

  defaultVariants: {
    size: 'xxl',
  },
});

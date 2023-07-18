import { styled } from '~/stitches';

import { headingSizeVariant } from './utils';

export const H3 = styled('h3', {
  color: '$textHeading',
  fontWeight: '500',

  variants: {
    size: headingSizeVariant,
  },

  defaultVariants: {
    size: 'l',
  },
});

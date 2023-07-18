import { styled } from '~/stitches';

import { headingSizeVariant } from './utils';

export const H4 = styled('h4', {
  color: '$textHeading',
  fontWeight: '500',

  variants: {
    size: headingSizeVariant,
  },

  defaultVariants: {
    size: 'm',
  },
});

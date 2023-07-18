import { styled } from '~/stitches';

import { headingSizeVariant } from './utils';

export const H2 = styled('h2', {
  color: '$textHeading',
  fontWeight: '500',

  variants: {
    size: headingSizeVariant,
  },

  defaultVariants: {
    size: 'xl',
  },
});

import { styled } from '~/stitches';

import { headingSizeVariant } from './utils';

export const H5 = styled('h5', {
  color: '$textHeading',
  fontWeight: '500',

  variants: {
    size: headingSizeVariant,
  },

  defaultVariants: {
    size: 's',
  },
});

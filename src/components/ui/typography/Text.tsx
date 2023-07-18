import { styled } from '~/stitches';

import { bodySizeVariant } from './utils';

export const Text = styled('span', {
  fontWeight: '400',

  variants: {
    size: bodySizeVariant,
  },

  defaultVariants: {
    size: 'm',
  },
});

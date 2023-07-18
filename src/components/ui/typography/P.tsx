import { styled } from '~/stitches';

import { bodySizeVariant } from './utils';

export const P = styled('p', {
  fontWeight: '400',

  mb: '1em',

  '&:where(:last-child)': {
    mb: '0',
  },

  variants: {
    size: bodySizeVariant,
  },

  defaultVariants: {
    size: 'm',
  },
});

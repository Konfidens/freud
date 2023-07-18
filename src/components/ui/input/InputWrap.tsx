import { styled } from '~/stitches';
import { iconClassName } from '../icon/constants';

export const InputWrap = styled('div', {
  display: 'inline-flex',
  position: 'relative',

  [`& .${iconClassName}`]: {
    color: '$gray500',
  },
  variants: {
    size: {
      medium: {
        [`& .${iconClassName}`]: {
          fontSize: '$sizes$6',
        },
      },
      large: {
        [`& .${iconClassName}`]: {
          fontSize: '$sizes$6',
        },
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

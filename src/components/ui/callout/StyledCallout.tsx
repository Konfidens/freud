import { styled } from '~/stitches';
import { iconClassName } from '../icon/constants';

const ICON_MARGIN = '$4';

export const StyledCallout = styled('div', {
  position: 'relative',
  borderRadius: '$lg',
  p: '$4',
  pl: `calc(${ICON_MARGIN} * 2 + $5)`,

  [`& .${iconClassName}`]: {
    position: 'absolute',
    left: 0,
    ml: ICON_MARGIN,
  },

  variants: {
    variant: {
      green: {
        bg: '$green10',
        color: '$green700',
      },
      gray: {
        bg: '$gray100',
        color: '$gray700',
      },
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
});

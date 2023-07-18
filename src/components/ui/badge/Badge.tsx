import { styled } from "~/stitches";


export const Badge = styled('div', {
  borderRadius: '$full',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$1',
  fontWeight: '500',
  fontSize: '$s',
  lineHeight: '$5',
  px: '$3',

  variants: {
    variant: {
      success: {
        bg: '$green50',
        color: '$green700',
      },
      warning: {
        bg: '$yellow50',
        color: '$yellow700',
      },
      error: {
        bg: '$red50',
        color: '$red700',
      },
      info: {
        bg: '$gray150',
        color: '$gray700',
      },
    },
    size: {
      small: {
        py: '2px',
      },
      medium: {
        py: '$1',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'warning',
  },
});

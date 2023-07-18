import { styled } from '~/stitches';
import { buttonClassName } from '../button/constants';

export const InputAddon = styled('div', {
  transition: 'all 80ms linear',
  flexShrink: 0,
  color: '$gray500',
  borderRadius: '$lg',

  [`input:disabled ~ &`]: {
    cursor: 'not-allowed',
  },

  variants: {
    side: {
      prefix: {
        borderRightRadius: '0',
        // Remove right shadow border
        clipPath: 'inset(-3px 1px -3px -3px)',
      },
      suffix: {
        borderLeftRadius: '0',
        // Remove left shadow border
        clipPath: 'inset(-3px -3px -3px 1px)',
      },
    },
    addonStyle: {
      none: {},
      borderless: {
        position: 'absolute',
        zIndex: 2,
      },
      border: {
        backgroundColor: '$gray50',
        boxShadow: '$border, $small',
      },
      button: {},
    },
    size: {
      medium: {
        fontSize: '$m',
        lineHeight: '$6',
        py: '$2',
        px: '$3',
      },
      large: {
        fontSize: '$l',
        lineHeight: '$6',
        py: '$3',
        px: '$4',
      },
    },
  },
  compoundVariants: [
    {
      addonStyle: 'borderless',
      side: 'prefix',
      css: {
        left: 0,
      },
    },
    {
      addonStyle: 'borderless',
      side: 'suffix',
      css: {
        right: 0,
      },
    },
    {
      addonStyle: 'button',
      size: 'medium',
      css: {
        py: 0,
        px: 0,
      },
    },
    {
      addonStyle: 'button',
      size: 'large',
      css: {
        py: 0,
        px: 0,
      },
    },
    {
      addonStyle: 'button',
      side: 'prefix',
      css: {
        clipPath: 'unset',
        [`& .${buttonClassName.button}`]: {
          borderRightRadius: 0,
        },
      },
    },
    {
      addonStyle: 'button',
      side: 'suffix',
      css: {
        clipPath: 'unset',
        [`& .${buttonClassName.button}`]: {
          borderLeftRadius: 0,
        },
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    addonStyle: 'borderless',
    side: 'prefix',
  },
});

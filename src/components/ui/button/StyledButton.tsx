import { styled } from "~/stitches";

import { iconClassName } from '../icon/constants';

import { buttonClassName } from './constants';

export const StyledButton = styled('button', {
  // Local variables
  $$border: '0 0 0 1px transparent',
  $$borderHover: '0 0 0 1px transparent',
  $$shadow: '0 2px 2px transparent',
  $$focusRing: '$shadows$focusRingWithLightOffset',
  $$bg: 'transparent',
  $$bgHover: '$colors$gray150',
  $$iconColor: '$colors$gray500',
  $$color: '$colors$textBody',
  $$disabledColor: '$colors$gray400',
  $$disabledBg: 'transparent',
  $$disabledIconColor: '$colors$gray350',

  border: 0,
  borderRadius: '$lg',
  fontWeight: '500',
  textDecoration: 'none',
  transition: 'all 80ms linear, transform 60ms linear',
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative',
  outline: 'none',
  willChange: 'transform',

  '&:not(:disabled,[disabled])': {
    cursor: 'pointer',
    bg: '$$bg',
    color: '$$color',
    boxShadow: '$$border, $$shadow',

    '&:hover': {
      bg: '$$bgHover',
      boxShadow: '$$borderHover, $$shadow',
    },

    '&:focus-visible': {
      // Make sure outline is display on top of sibling buttons
      zIndex: '1',
      boxShadow: '$$border, $$shadow, $$focusRing',
    },
    '&:focus-visible:hover': {
      boxShadow: '$$borderHover, $$shadow, $$focusRing',
    },

    '&:active': {
      transform: 'translateY(1px)',
    },

    [`& .${iconClassName}`]: {
      color: '$$iconColor',
    },
  },

  '&:disabled, &[disabled]': {
    cursor: 'not-allowed',
    color: '$$disabledColor',
    bg: '$$disabledBg',

    [`& .${iconClassName}`]: {
      color: '$$disabledIconColor',
    },
  },

  variants: {
    color: {
      gray: {
        $$color: '$colors$textBody',
        $$bg: '$colors$gray100',
        $$bgHover: '$colors$gray150',
        $$border: '$shadows$border',
        $$borderHover: '$shadows$borderHover',
        $$shadow: '$shadows$small',
        $$iconColor: '$colors$gray500',
        $$disabledColor: '$colors$gray400',
        $$disabledBg: '$colors$gray50',
        $$disabledIconColor: '$colors$gray350',
      },
      white: {
        $$color: '$colors$textBody',
        $$bg: '#fff',
        $$bgHover: '$colors$gray150',
        $$border: '$shadows$border',
        $$borderHover: '$shadows$borderHover',
        $$shadow: '$shadows$small',
        $$iconColor: '$colors$gray500',
        $$disabledColor: '$colors$gray400',
        $$disabledBg: '$colors$gray50',
        $$disabledIconColor: '$colors$gray350',
      },
      lightGreen: {
        $$color: '$colors$green900',
        $$bg: '$colors$green100',
        $$bgHover: '$colors$green200',
        $$iconColor: '$colors$green600',
        $$disabledColor: 'white',
        $$disabledBg: '$colors$gray350',
        $$disabledIconColor: '$colors$gray50',
      },
      green: {
        $$color: 'white',
        $$bg: '$colors$green700',
        $$bgHover: '$colors$green750',
        $$iconColor: '$colors$green100',
        $$disabledColor: 'white',
        $$disabledBg: '$colors$gray350',
        $$disabledIconColor: '$colors$gray50',
      },
      darkGreen: {
        $$color: 'white',
        $$bg: '$colors$green900',
        $$bgHover: '$colors$green950',
        $$iconColor: '$colors$green100',
        $$disabledColor: 'white',
        $$disabledBg: '$colors$gray350',
        $$disabledIconColor: '$colors$gray50',
      },
      red: {
        $$color: 'white',
        $$bg: '$colors$red500',
        $$bgHover: '$colors$red550',
        $$iconColor: '$colors$red100',
        $$disabledColor: 'white',
        $$disabledBg: '$colors$gray350',
        $$disabledIconColor: '$colors$gray50',
      },
      yellow: {
        $$color: '$colors$yellow900',
        $$bg: '$colors$yellow350',
        $$bgHover: '$colors$yellow400',
        $$iconColor: '$colors$yellow600',
        $$disabledColor: 'white',
        $$disabledBg: '$colors$gray350',
        $$disabledIconColor: '$colors$gray50',
      },
      black: {
        $$color: 'white',
        $$bg: '$colors$gray800',
        $$bgHover: '$colors$gray900',
        $$iconColor: '$colors$gray300',
        $$disabledColor: 'white',
        $$disabledBg: '$colors$gray350',
        $$disabledIconColor: '$colors$gray50',
      },
      transparent: {
        $$color: '$colors$textBody',
        $$bg: 'hsl(0 0% 0% / 0)',
        $$bgHover: '$colors$gray100',
        $$iconColor: '$colors$gray500',
        $$disabledColor: '$colors$gray400',
        $$disabledIconColor: '$colors$gray350',
        $$focusRing: '$shadows$focusRing',
      },
    },
    size: {
      small: {
        fontSize: '$s',
        lineHeight: '$6',
        py: '$2',
        px: '$2',

        [`& .${iconClassName}`]: {
          fontSize: '$sizes$5',
        },

        [`& .${buttonClassName.prefix}`]: {
          pr: '$2',
        },

        [`& .${buttonClassName.suffix}`]: {
          pl: '$2',
        },
      },
      medium: {
        fontSize: '$m',
        lineHeight: '$6',
        py: '$2',
        px: '$3',

        [`& .${iconClassName}`]: {
          fontSize: '$sizes$6',
        },

        [`& .${buttonClassName.prefix}`]: {
          pr: '$3',
        },

        [`& .${buttonClassName.suffix}`]: {
          pl: '$3',
        },
      },
      large: {
        fontSize: '$l',
        lineHeight: '$6',
        py: '$3',
        px: '$4',

        [`& .${iconClassName}`]: {
          fontSize: '$sizes$6',
        },

        [`& .${buttonClassName.prefix}`]: {
          pr: '$4',
        },

        [`& .${buttonClassName.suffix}`]: {
          pl: '$4',
        },
      },
    },
    align: {
      center: {
        justifyContent: 'center',
        textAlign: 'center',
      },
      'space-between': {
        justifyContent: 'space-between',
        textAlign: 'center',
      },
      left: {
        justifyContent: 'left',
        textAlign: 'left',
      },
      right: {
        justifyContent: 'right',
        textAlign: 'right',
      },
    },

    // Useful in cases where where buttons with borders (e.g. white and gray) are lined up
    // against buttons without a border (green, black). This is useful for things like
    // Toggle Groups, where the 1px difference in height would become very evident.
    withBorder: {
      true: {},
      false: {},
    },

    focusRingOffsetColor: {
      light: { $$focusRing: '$shadows$focusRingWithLightOffset' },
      dark: { $$focusRing: '$shadows$focusRingWithDarkOffset' },
      noOffset: { $$focusRing: '$shadows$focusRing' },
    },

    menu: {
      none: {},
      leftPart: { borderRightRadius: 0 },
      rightPart: { borderLeftRadius: 0 },
    },
  },

  compoundVariants: [
    // withBorder
    {
      withBorder: true,
      color: 'green',
      css: {
        $$border: '0 0 0 1px $colors$green700',
        $$borderHover: '0 0 0 1px $colors$green750',
      },
    },
    {
      withBorder: true,
      color: 'lightGreen',
      css: {
        $$border: '0 0 0 1px $colors$green300',
        $$borderHover: '0 0 0 1px $colors$green350',
        $$shadow: '$shadows$small',
      },
    },
    {
      withBorder: true,
      color: 'red',
      css: {
        $$border: '0 0 0 1px $colors$red500',
        $$borderHover: '0 0 0 1px $colors$red550',
      },
    },
    {
      withBorder: true,
      color: 'yellow',
      css: {
        $$border: '0 0 0 1px $colors$yellow350',
        $$borderHover: '0 0 0 1px $colors$yellow400',
      },
    },
    {
      withBorder: true,
      color: 'black',
      css: {
        $$border: '0 0 0 1px $colors$gray800',
        $$borderHover: '0 0 0 1px $colors$gray900',
      },
    },
    {
      withBorder: true,
      color: 'transparent',
      css: {
        $$borderHover: '0 0 0 1px $colors$gray100',
      },
    },
    // focusRingOffsetColor
    {
      focusRingOffsetColor: 'light',
      color: 'transparent',
      css: { $$focusRing: '$shadows$focusRingWithLightOffset' },
    },
    {
      focusRingOffsetColor: 'dark',
      color: 'transparent',
      css: { $$focusRing: '$shadows$focusRingWithDarkOffset' },
    },
    // menu
    {
      color: 'lightGreen',
      menu: 'leftPart',
      withBorder: 'false',
      css: {
        '&:not(:disabled,[disabled])': {
          borderRight: '1px solid $colors$green200',
        },
      },
    },
    {
      color: 'green',
      menu: 'leftPart',
      css: {
        '&:not(:disabled,[disabled])': {
          borderRight: '1px solid $colors$green750',
        },
      },
    },
    {
      color: 'yellow',
      menu: 'leftPart',
      css: {
        '&:not(:disabled,[disabled])': {
          borderRight: '1px solid $colors$yellow450',
        },
      },
    },
    {
      color: 'red',
      menu: 'leftPart',
      css: {
        '&:not(:disabled,[disabled])': {
          borderRight: '1px solid $colors$red550',
        },
      },
    },
    {
      color: 'black',
      menu: 'leftPart',
      css: {
        '&:not(:disabled,[disabled])': {
          borderRight: '1px solid $colors$gray700',
        },
      },
    },
  ],
  defaultVariants: {
    color: 'gray',
    size: 'medium',
    align: 'space-between',
    withBorder: false,
    menu: 'none',
  },
});

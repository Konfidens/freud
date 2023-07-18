export const headingSizeVariant = {
  xs: {
    fontSize: '$m',
    lineHeight: '$6',
    minHeight: '$lineHeights$6',
  },
  s: {
    fontSize: '$l',
    lineHeight: '$7',
    minHeight: '$lineHeights$7',
  },
  m: {
    fontSize: '$xl',
    lineHeight: '$7',
    minHeight: '$lineHeights$7',
  },
  l: {
    fontSize: '$2xl',
    lineHeight: '$8',
    minHeight: '$lineHeights$8',
  },
  xl: {
    fontSize: '$2xl',
    lineHeight: '$8',
    minHeight: '$lineHeights$8',
    '@m1': {
      fontSize: '$3xl',
      lineHeight: '$9',
      minHeight: '$lineHeights$9',
    },
  },
  xxl: {
    fontSize: '$3xl',
    lineHeight: '$9',
    minHeight: '$lineHeights$9',
    '@m1': {
      fontSize: '$4xl',
      lineHeight: '$10',
      minHeight: '$lineHeights$10',
    },
  },
} as const;

export const bodySizeVariant = {
  xs: {
    fontSize: '$xs',
    lineHeight: '$4',
    color: '$textMuted',
  },
  s: {
    fontSize: '$s',
    lineHeight: '$5',
    color: '$textMuted',
  },
  m: {
    fontSize: '$m',
    lineHeight: '$6',
    color: '$textBody',
  },
  l: {
    fontSize: '$l',
    lineHeight: '$7',
    color: '$textBody',
  },
  xl: {
    fontSize: '$xl',
    lineHeight: '$7',
    color: '$textBody',
  },
} as const;

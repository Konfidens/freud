import { styled } from '~/stitches';
import {
  AVATAR_PARENT_CLASSNAME,
  AVATAR_PARENT_SELECTED_CLASSNAME,
} from '../avatar/Avatar';
import { Div } from '../basic/Div';
import { LI } from '../basic/LI';
import { LinkWrap } from '../linkWrap/LinkWrap';

import { selectionListClassName } from './constants';

export const ItemGroup = styled('ul', {
  listStyle: 'none',
});

type LiProps = React.ComponentProps<typeof LI>;

type ItemProps = Omit<LiProps, 'prefix'> & {
  children: React.ReactNode;
  href?: string;
  selected?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onClick?: () => void;
};

export const Item = ({
  children,
  href,
  css,
  selected,
  disabled,
  onClick,
  prefix,
  suffix,
  ...rest
}: ItemProps) => {
  return (
    <LI {...rest}>
      <LinkWrap href={disabled ? undefined : href}>
        <StyledItem
          as={href ? 'a' : 'button'}
          css={css}
          selected={selected}
          disabled={disabled}
          onClick={disabled ? undefined : onClick}
          className={`${AVATAR_PARENT_CLASSNAME} ${selected ? AVATAR_PARENT_SELECTED_CLASSNAME : ''
            }`}
        >
          {!!prefix && (
            <div className={selectionListClassName.PREFIX}>{prefix}</div>
          )}
          <Div
            css={{
              // Truncate text if necessary
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {children}
          </Div>
          {!!suffix && (
            <div className={selectionListClassName.SUFFIX}>{suffix}</div>
          )}
        </StyledItem>
      </LinkWrap>
    </LI>
  );
};

const StyledItem = styled('a', {
  display: 'flex',
  alignItems: ' center',
  textDecoration: 'none',
  width: '100%',
  py: '$2',
  px: '$3',
  outline: 'none',
  border: 'none',
  borderRadius: '$lg',
  mb: '$1',
  cursor: 'pointer',

  'li:last-child &': {
    mb: 0,
  },

  '&:focus-visible': {
    boxShadow: '$focusRing',
    zIndex: '1',
    position: 'relative', // Needed for z-index
  },

  '&:disabled, &[disabled]': {
    cursor: 'not-allowed',
  },

  [`& .${selectionListClassName.PREFIX}`]: {
    pr: '$3',
  },

  [`& .${selectionListClassName.SUFFIX}`]: {
    pl: '$3',
  },

  variants: {
    selected: {
      false: {
        bg: 'white',
        color: '$textBody',

        '&:hover': {
          bg: '$gray100',
        },

        '&:disabled, &[disabled]': {
          color: '$gray400',

          '&:hover': {
            bg: 'white',
          },
        },
      },
      true: {
        bg: '$green50',
        color: '$green700',
        fontWeight: 500,

        '&:hover': {
          bg: '$green75',
        },

        '&:disabled, &[disabled]': {
          color: '$gray400',
          bg: '$gray200',
        },
      },
    },
  },

  defaultVariants: {
    selected: 'false',
  },
});

export const Heading = styled('div', {
  fontSize: '$xs',
  color: '$gray400',
  fontWeight: 500,
  textTransform: 'uppercase',
  ml: '$3',
  mt: '$4',
  mb: '$1',
});

import { styled } from '~/stitches';
import { iconClassName } from '../icon/constants';
import { LinkWrap } from '../linkWrap/LinkWrap';

const Li = styled('li', {
  display: 'block',
  width: 'max-content',
});

const StyledTab = styled('a', {
  textDecoration: 'none',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  p: '$1',
  outline: 'none',
  borderRadius: '$sm',
  position: 'relative',

  '&:focus-visible': {
    boxShadow: '$focusRingWithLightOffset',
  },

  [`& .${iconClassName}`]: {
    fontSize: '$sizes$6',
  },

  variants: {
    active: {
      false: {
        color: '$gray600',

        [`& .${iconClassName}`]: {
          color: '$gray400',
        },
        [`&:hover`]: {
          color: '$gray700',

          [`& .${iconClassName}`]: {
            color: '$gray500',
          },
        },
      },
      true: {
        color: '$green900',

        [`& .${iconClassName}`]: {
          color: '$green450',
        },
      },
    },
  },
  defaultVariants: {
    active: 'false',
  },
});

const Underline = styled('div', {
  height: '2px',
  width: '100%',
  position: 'absolute',
  bottom: '-3px',
  left: 0,

  variants: {
    active: {
      false: {
        [`${StyledTab}:hover &`]: {
          bg: '$gray300',
        },
      },
      true: {
        bg: '$green450',
      },
    },
  },
  defaultVariants: {
    active: 'false',
  },
});

type StyledTabProps = React.ComponentProps<typeof StyledTab>;
type Props = Omit<StyledTabProps, 'prefix'> & {
  children: React.ReactNode;
  href: string;
  active?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

export const Tab = ({ children, href, active, prefix, suffix, css }: Props) => {
  return (
    <Li>
      <LinkWrap href={href}>
        <StyledTab active={active} css={css}>
          {!!prefix && prefix}
          {children}
          <Underline active={active} />
          {!!suffix && suffix}
        </StyledTab>
      </LinkWrap>
    </Li>
  );
};

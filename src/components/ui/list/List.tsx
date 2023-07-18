import { styled } from '~/stitches';
import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';
import { LinkWrap } from '../linkWrap/LinkWrap';
import { Popover } from '../popover/Popover';

export const Separator = styled('div', {
  bg: '$gray100',
  px: '$6',
  py: '$1',
  textTransform: 'uppercase',
  fontSize: '$xs',
  color: '$textMuted',
  fontWeight: '500',
  letterSpacing: '$wider',
});

export const ItemGroup = styled('ul', {
  listStyle: 'none',

  // Give every child a border except the last one
  '& > * + *': {
    borderTop: '1px solid $colors$gray150',
  },
});

const Li = styled('li', {
  position: 'relative',
});

type ListItemProps = React.ComponentProps<typeof Li> & {
  leftContent: React.ReactNode;
  rightContentAbsolute?: boolean;
  rightContent?: React.ReactNode;
  href?: string;
  menu?: React.ReactNode;
};

export const Item = ({
  leftContent,
  rightContent,
  rightContentAbsolute = false,
  href,
  css,
  menu,
  ...rest
}: ListItemProps) => {
  return (
    <Li {...rest}>
      <LinkWrap href={href}>
        <Div
          as={href ? 'a' : 'span'}
          css={{
            bg: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textDecoration: 'none',
            color: '$textHeading',
            width: '100%',
            py: '$2',
            pl: '$6',
            pr: menu ? '$16' : '$6',
            minHeight: '$16',
            outline: 'none',

            '&:hover': {
              bg: href ? '$gray50' : 'white',
            },

            '&:focus-visible': {
              boxShadow: '$focusRing',
              zIndex: '1',
              position: 'relative', // Needed for z-index
            },

            ...css,
          }}
        >
          <Div
            css={{
              color: '$textHeading',

              // Truncate text if necessary
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {leftContent}
          </Div>
          {rightContent && !rightContentAbsolute && (
            <Div
              css={{
                flexShrink: 0,
                ml: '$6',
                gap: '$4',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightContent}
            </Div>
          )}
        </Div>
      </LinkWrap>
      {(menu || (rightContent && rightContentAbsolute)) && (
        <Div
          css={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            mr: '$2',

            // Avoid the menu being hidden while list item is focused
            '*:focus-visible + &': {
              zIndex: 2,
            },
          }}
        >
          {rightContent && rightContentAbsolute && (
            <Div
              css={{
                flexShrink: 0,
                ml: '$6',
                pr: '$2',
                gap: '$4',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightContent}
            </Div>
          )}
          {menu && (
            <Popover
              align="end"
              css={{ p: '$1' }}
              content={
                <Div css={{ display: 'flex', flexDirection: 'column' }}>
                  {menu}
                </Div>
              }
            >
              <Button color="transparent">
                <Icon name="dotsHorizontal" />
              </Button>
            </Popover>
          )}
        </Div>
      )}
    </Li>
  );
};

export const Wrap = styled('div', {
  bg: 'white',
  boxShadow: '$medium',
  borderRadius: '$lg',

  // Round corners on first and last element.
  // While it would be much easier to just slap
  // overflow: hidden on the wrap, that strategy
  // ruins the focus state.
  [`& ${Separator}:first-child, 
    & ${ItemGroup}:first-child li:first-child > *`]: {
    borderTopRadius: '$lg',
  },
  [`& ${Separator}:last-child,
    & ${ItemGroup}:last-child li:last-child > *`]: {
    borderBottomRadius: '$lg',
  },
});

import { useRouter } from 'next/router';
import React from 'react';

import { Div } from '../../basic/Div';
import { LinkWrap } from '../../linkWrap/LinkWrap';

import { ItemText } from './ItemText';
import { StyledItem } from './StyledItem';

type StyledLinkProps = React.ComponentProps<typeof StyledItem>;

type Props = Omit<StyledLinkProps, 'prefix'> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  minified?: boolean;
  minifiedText?: string;
  as?: React.ElementType;
};

export const Item = React.forwardRef(
  (
    {
      children,
      href,
      prefix,
      suffix,
      minified,
      minifiedText,
      as,
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) => {
    const router = useRouter();
    const path = router.pathname;

    return (
      <LinkWrap href={href}>
        <StyledItem
          ref={ref}
          active={!!href && path.includes(href)}
          as={as}
          {...rest}
        >
          {!!prefix && <Div css={{ flexShrink: 0 }}>{prefix}</Div>}
          <ItemText minified={minified} minifiedText={minifiedText}>
            {children}
          </ItemText>
          {!!suffix && <Div css={{ flexShrink: 0, ml: 'auto' }}>{suffix}</Div>}
        </StyledItem>
      </LinkWrap>
    );
  },
);
Item.displayName = 'Sidebar.Item';

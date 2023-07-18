import React from 'react';

import { Icon } from '../icon/Icon';
import { LinkWrap } from '../linkWrap/LinkWrap';

import { StyledLink } from './StyledLink';

type StyledLinkProps = React.ComponentProps<typeof StyledLink>;
type Props = Omit<StyledLinkProps, 'prefix'> & {
  as?: React.ElementType;
  disabled?: boolean;
  loading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

export const Link = React.forwardRef(
  (
    {
      as,
      children,
      disabled,
      href,
      loading,
      onClick,
      rel,
      target,
      prefix,
      suffix,
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) => {
    return (
      <LinkWrap href={href}>
        <StyledLink
          as={href ? 'a' : as}
          asButton={as === 'button'}
          ref={ref}
          target={target}
          // Automatically add 'noopener' when target is "_blank" to
          // avoid a security issue
          // https://web.dev/external-anchors-use-rel-noopener/
          rel={target === '_blank' && !rel ? 'noopener' : rel}
          disabled={disabled}
          onClick={loading || disabled ? undefined : onClick}
          withAddon={!!prefix || !!suffix}
          {...rest}
        >
          {prefix && <div>{loading ? <Icon name="spinner" /> : prefix}</div>}
          {children}
          {suffix && <div>{loading ? <Icon name="spinner" /> : suffix}</div>}
        </StyledLink>
      </LinkWrap>
    );
  },
);
Link.displayName = 'Link';

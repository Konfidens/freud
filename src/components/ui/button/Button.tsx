import React from 'react';

import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';
import { LinkWrap } from '../linkWrap/LinkWrap';
import { Popover, type PopoverProps } from '../popover/Popover';

import { ButtonContentWrap } from './ButtonContentWrap';
import { StyledButton } from './StyledButton';
import { buttonClassName } from './constants';

type StyledButtonProps = React.ComponentProps<typeof StyledButton>;

type Props = Omit<StyledButtonProps, 'prefix' | 'menu'> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  target?: string;
  loading?: boolean;
  menu?: React.ReactNode;
  menuProps?: PopoverProps;
};

const InternalButton = React.forwardRef(
  (
    {
      prefix,
      suffix,
      children,
      css,
      href,
      loading,
      disabled,
      onClick,
      as,
      align: rawAlign,
      menu,
      menuProps,
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const fallbackAlign = prefix || suffix ? 'space-between' : 'center';
    const align = rawAlign || fallbackAlign;

    return (
      <>
        <LinkWrap href={disabled ? undefined : href}>
          <StyledButton
            as={href ? 'a' : as}
            css={css}
            disabled={disabled}
            onClick={loading || disabled ? undefined : onClick}
            className={buttonClassName.button}
            align={align}
            menu={menu ? 'leftPart' : 'none'}
            {...rest}
            ref={ref}
          >
            {prefix && (
              <div className={buttonClassName.prefix}>
                {loading ? <Icon name="spinner" /> : prefix}
              </div>
            )}
            <ButtonContentWrap
              loading={loading}
              prefix={prefix}
              suffix={suffix}
            >
              {children}
            </ButtonContentWrap>
            {suffix && (
              <div className={buttonClassName.suffix}>
                {loading ? <Icon name="spinner" /> : suffix}
              </div>
            )}
          </StyledButton>
        </LinkWrap>
      </>
    );
  },
);

InternalButton.displayName = 'InternalButton';

type MenuButtonProps = {
  color?: StyledButtonProps['color'];
  size?: StyledButtonProps['size'];
  withBorder?: StyledButtonProps['withBorder'];
  disabled?: boolean;
  menu?: React.ReactNode;
  menuProps?: PopoverProps;
};

const MenuButton = ({
  menu,
  menuProps,
  color,
  disabled,
  size,
  withBorder,
}: MenuButtonProps) => (
  <Popover
    align="end"
    css={{ p: '$1' }}
    content={
      <Div css={{ display: 'flex', flexDirection: 'column' }}>{menu}</Div>
    }
    {...menuProps}
  >
    <StyledButton
      menu="rightPart"
      color={color}
      disabled={disabled}
      size={size}
      withBorder={withBorder}
      css={{
        width: size === 'large' ? '$12' : '$10',
        px: size === 'large' ? '$3' : '$2',
      }}
    >
      <Icon name="chevronDown" />
    </StyledButton>
  </Popover>
);

export const Button = React.forwardRef(
  (
    { disabled, menu, menuProps, color, size, withBorder, ...rest }: Props,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    if (menu) {
      return (
        <Div css={{ display: 'inline-flex' }}>
          <InternalButton
            menu={menu}
            color={color}
            disabled={disabled}
            size={size}
            withBorder={withBorder}
            {...rest}
            ref={ref}
          />
          <MenuButton
            menu={menu}
            menuProps={menuProps}
            color={color}
            disabled={disabled}
            size={size}
            withBorder={withBorder}
          />
        </Div>
      );
    }

    return (
      <InternalButton
        menu={menu}
        color={color}
        disabled={disabled}
        size={size}
        withBorder={withBorder}
        {...rest}
        ref={ref}
      />
    );
  },
);

Button.displayName = 'Button';

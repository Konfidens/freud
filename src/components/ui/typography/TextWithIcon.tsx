import { CSS } from '~/stitches';
import { A } from '../basic/A';
import { Div } from '../basic/Div';
import { Icon, IconName } from '../icon/Icon';
import { LinkWrap } from '../linkWrap/LinkWrap';

import { P } from './P';

type Props = {
  children: React.ReactNode;
  iconName: IconName;
  'aria-label': string;
  size?: 'small' | 'medium';
  href?: string;
  css?: CSS;
};

export const TextWithIcon = ({
  children,
  iconName,
  'aria-label': AriaLabel,
  size = 'medium',
  href,
  css,
}: Props) => {
  return (
    <Div css={{ display: 'flex', alignItems: 'center', gap: '$2', ...css }}>
      <Div css={{ flexShrink: 0 }}>
        <Icon
          name={iconName}
          size={size === 'small' ? 5 : 6}
          color="gray500"
          aria-label={AriaLabel}
        />
      </Div>
      <P as="div" size={size === 'small' ? 's' : 'm'}>
        {href ? (
          <LinkWrap href={href}>
            <A
              css={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {children}
            </A>
          </LinkWrap>
        ) : (
          children
        )}
      </P>
    </Div>
  );
};

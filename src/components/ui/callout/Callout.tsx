import React from 'react';

import { Icon, IconName } from '../icon/Icon';

import { StyledCallout } from './StyledCallout';

type StyledCalloutProps = React.ComponentProps<typeof StyledCallout>;

type Props = StyledCalloutProps & {
  iconName: IconName;
};

export const Callout = ({
  children,
  iconName = 'exclamation',
  ...rest
}: Props) => (
  <StyledCallout {...rest}>
    <Icon name={iconName} size="6" />
    {children}
  </StyledCallout>
);

import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';

import { Badge } from './Badge';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Badge,
} as Meta;

const Template = (props: React.ComponentProps<typeof Badge>) => (
  <Badge {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Badge>;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <Icon name="exclamation" />
      Ubetalt regning
    </>
  ),
};

export const Variants = () => {
  return (
    <Div
      css={{
        display: 'flex',
        gap: '$4',
      }}
    >
      <Badge variant="info">
        <Icon name="exclamation" />
        Info
      </Badge>
      <Badge variant="success">
        <Icon name="exclamation" />
        Success
      </Badge>
      <Badge variant="warning">
        <Icon name="exclamation" />
        Warning
      </Badge>
      <Badge variant="error">
        <Icon name="exclamation" />
        Error
      </Badge>
    </Div>
  );
};

export const Sizes = () => {
  return (
    <Div
      css={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '$4',
      }}
    >
      <Badge size="medium">
        <Icon name="exclamation" />
        Medium
      </Badge>
      <Badge size="small">
        <Icon name="exclamation" />
        Small
      </Badge>
    </Div>
  );
};

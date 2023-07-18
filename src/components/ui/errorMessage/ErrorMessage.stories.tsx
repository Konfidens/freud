import { Meta } from '@storybook/react';

import { ErrorMessage } from './ErrorMessage';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: ErrorMessage,
} as Meta;

const Template = (props: React.ComponentProps<typeof ErrorMessage>) => (
  <ErrorMessage {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof ErrorMessage>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Please enter your email address',
  show: true,
};

export const Warning = Template.bind({});
Warning.args = {
  children: 'Please enter your email address',
  show: true,
  variant: 'warning',
};

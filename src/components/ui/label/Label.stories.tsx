import { Meta } from '@storybook/react';

import { Label } from './Label';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Label,
} as Meta;

const Template = (props: React.ComponentProps<typeof Label>) => (
  <Label {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Label>;

export const LabelDefault = Template.bind({});
LabelDefault.args = {
  children: 'Your phone number',
};

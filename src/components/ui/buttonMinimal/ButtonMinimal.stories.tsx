import { Meta } from '@storybook/react';

import { ButtonMinimal } from './ButtonMinimal';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: ButtonMinimal,
} as Meta;

const Template = (props: React.ComponentProps<typeof ButtonMinimal>) => (
  <ButtonMinimal {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof ButtonMinimal>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Button with minimal styling',
};

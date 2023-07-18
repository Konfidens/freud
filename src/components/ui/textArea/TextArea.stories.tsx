import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';

import { TextArea } from './TextArea';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: TextArea,
} as Meta;

const Template = (props: React.ComponentProps<typeof TextArea>) => (
  <TextArea {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof TextArea>;

export const Basic = Template.bind({});
Basic.args = {
  placeholder: 'Write in meeee!',
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: "Can't touch this",
  disabled: true,
};

export const Resizing = () => (
  <Div css={{ display: 'flex', flexDirection: 'column', gap: '$4' }}>
    <TextArea resize="none" placeholder="No resizing" />
    <TextArea
      resize="vertical"
      placeholder="Vertical resizing only (default)"
    />
    <TextArea resize="horizontal" placeholder="Horizontal resizing only" />
    <TextArea
      resize="both"
      placeholder="Both horizontal and vertical resizing"
    />
  </Div>
);

export const CustomSize = Template.bind({});
CustomSize.args = {
  placeholder: 'Text area with custom size',
  css: {
    width: '$96',
    height: '$48',
  },
};

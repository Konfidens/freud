import { Meta } from '@storybook/react';

import { Icon, IconNameValues } from './Icon';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Icon,
} as Meta;

const Template = (props: React.ComponentProps<typeof Icon>) => (
  <Icon {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Icon>;

export const IconDefault = Template.bind({});
IconDefault.args = {
  name: 'book',
};
export const IconWithOptionalProps = Template.bind({});
IconWithOptionalProps.args = {
  name: 'eyeClosed',
  color: 'red500',
  size: '20',
  strokeWidth: 1,
};

export const IconSpinner = Template.bind({});
IconSpinner.args = {
  name: 'spinner',
};

export const allIcons = () => {
  return (
    <div>
      {Object.values(IconNameValues).map((name) => (
        <div
          key={name}
          style={{
            display: 'inline-flex',
            flexDirection: 'row',
            padding: '1rem',
            border: '1px solid black',
          }}
        >
          <Icon name={name} size="6" />
          <span style={{ marginLeft: '1rem' }}>{name}</span>
        </div>
      ))}
    </div>
  );
};

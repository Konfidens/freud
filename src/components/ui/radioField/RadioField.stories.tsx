import { Meta } from '@storybook/react';

import { RadioField } from './RadioField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: RadioField,
} as Meta;

const Template = (props: React.ComponentProps<typeof RadioField>) => (
  <RadioField {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof RadioField>;

const options = [
  { value: 'cats', label: 'Cats' },
  { value: 'dogs', label: 'Dogs' },
];

export const Basic = Template.bind({});
Basic.args = {
  id: 'my-favorite-pet',
  options,
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  id: 'my-favorite-pet',
  options,
  defaultValue: 'cats',
};

export const WithLegend = Template.bind({});
WithLegend.args = {
  id: 'my-favorite-pet',
  legend: 'Favorite pet?',
  options,
};

export const Disabled = Template.bind({});
Disabled.args = {
  id: 'my-favorite-pet',
  options,
  defaultValue: 'cats',
  disabled: true,
};

export const Small = Template.bind({});
Small.args = {
  id: 'my-favorite-pet',
  options,
  size: 'small',
};

export const Error = Template.bind({});
Error.args = {
  id: 'my-favorite-pet',
  options,
  error: true,
  errorMessage: 'You must select both. Come on! Do it!',
};

export const ErrorSmall = Template.bind({});
ErrorSmall.args = {
  id: 'my-favorite-pet',
  options,
  size: 'small',
  error: true,
  errorMessage: 'You must select both. Come on! Do it!',
};

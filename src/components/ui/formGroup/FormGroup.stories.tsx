import { Meta } from '@storybook/react';

import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';
import { Input } from '../input/Input';

import { FormGroup } from './FormGroup';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: FormGroup,
} as Meta;

const Template = (props: React.ComponentProps<typeof FormGroup>) => (
  <FormGroup {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof FormGroup>;

export const Buttons = () => {
  return (
    <FormGroup>
      <Button aria-label="Bold">
        <Icon name="bold" />
      </Button>
      <Button aria-label="Italic">
        <Icon name="italic" />
      </Button>
      <Button aria-label="Underline">
        <Icon name="underline" />
      </Button>
    </FormGroup>
  );
};

export const ButtonAndInput = () => {
  return (
    <FormGroup>
      <Input placeholder="Search" prefix={<Icon name="search" />} />
      <Button prefix={<Icon name="filter" />}>Filter</Button>
    </FormGroup>
  );
};

export const ButtonAndInputLarge = () => {
  return (
    <FormGroup>
      <Input
        size="large"
        placeholder="Search"
        prefix={<Icon name="search" />}
      />
      <Button size="large" prefix={<Icon name="filter" />}>
        Filter
      </Button>
    </FormGroup>
  );
};

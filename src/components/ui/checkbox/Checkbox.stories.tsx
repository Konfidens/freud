import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Div } from '../basic/Div';
import { Label } from '../label/Label';

import { Checkbox } from './Checkbox';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Checkbox,
} as Meta;

const Template = (props: React.ComponentProps<typeof Checkbox>) => (
  <Checkbox {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Checkbox>;

export const Simple = Template.bind({});
Simple.args = {};

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  defaultChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const DisabledAndChecked = Template.bind({});
DisabledAndChecked.args = {
  disabled: true,
  defaultChecked: true,
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
};

export const WithReactHookFormAndLabel = () => {
  const { setValue, watch } = useForm<{ consent: boolean }>();
  const hasConsent = watch('consent');

  return (
    <Div css={{ display: 'flex', alignItems: 'center', gap: '$3' }}>
      <Checkbox
        id="check"
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            setValue('consent', checked);
          }
        }}
      />
      <Label htmlFor="check">
        {(hasConsent && 'Thanks') || 'I can has consent?'}
      </Label>
    </Div>
  );
};

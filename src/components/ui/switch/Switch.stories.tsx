import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Div } from '../basic/Div';
import { Label } from '../label/Label';

import { Switch, SwitchProps } from './Switch';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Switch,
} as Meta;

const Template = (props: SwitchProps) => <Switch {...props} />;
Template.args = undefined as undefined | SwitchProps;

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

export const Size = () => {
  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$3',
      }}
    >
      <Switch id="check" size="small" />
      <Switch id="check" size="medium" />
      <Switch id="check" size="large" />
    </Div>
  );
};

export const WithReactHookFormAndLabel = () => {
  const { setValue, watch } = useForm<{ consent: boolean }>();
  const hasConsent = watch('consent');

  return (
    <Div css={{ display: 'flex', alignItems: 'center', gap: '$3' }}>
      <Switch
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

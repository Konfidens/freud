import { Meta } from '@storybook/react';
import { useState } from 'react';

import { Div } from '../basic/Div';
import { Label } from '../label/Label';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Radio,
} as Meta;

const Template = (props: React.ComponentProps<typeof Radio>) => (
  <Radio {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Radio>;

export const Basic = () => (
  <RadioGroup css={{ display: 'flex', flexDirection: 'column', gap: '$3' }}>
    <Radio value="cheese" />
    <Radio value="wine" />
  </RadioGroup>
);
export const DefaultValue = () => (
  <RadioGroup
    defaultValue="cheese"
    css={{ display: 'flex', flexDirection: 'column', gap: '$3' }}
  >
    <Radio value="cheese" />
    <Radio value="wine" />
  </RadioGroup>
);

export const Disabled = () => (
  <RadioGroup
    defaultValue="cheese"
    css={{ display: 'flex', flexDirection: 'column', gap: '$3' }}
  >
    <Radio value="cheese" disabled />
    <Radio value="wine" disabled />
  </RadioGroup>
);
export const Small = () => (
  <RadioGroup css={{ display: 'flex', flexDirection: 'column', gap: '$3' }}>
    <Radio value="cheese" size="small" />
    <Radio value="wine" size="small" />
  </RadioGroup>
);

export const AsControlledField = () => {
  const [val, setVal] = useState<string>();

  return (
    <Div css={{ display: 'flex', alignItems: 'center', gap: '$3' }}>
      <RadioGroup value={val} onValueChange={(v) => setVal(v)}>
        <Div css={{ display: 'flex', flexDirection: 'row' }}>
          <Radio
            id="cheese"
            value="cheese"
            css={{ marginRight: '$2', marginBottom: '$2' }}
          />
          <Label htmlFor="cheese">Cheese</Label>
        </Div>
        <Div css={{ display: 'flex', flexDirection: 'row' }}>
          <Radio id="wine" value="wine" css={{ marginRight: '$2' }} />
          <Label htmlFor="wine">Wine</Label>
        </Div>
      </RadioGroup>
    </Div>
  );
};

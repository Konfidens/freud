import { Meta } from '@storybook/react';

import { Badge } from '../badge/Badge';
import { Icon } from '../icon/Icon';

import { Tab } from './Tab';
import { Tabs } from './Tabs';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Tab,
} as Meta;

const Template = (props: React.ComponentProps<typeof Tab>) => (
  <Tab {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Tab>;

export const TabsDefault = () => (
  <Tabs>
    <Tab href="#" prefix={<Icon name="book" />} active>
      Journal
    </Tab>
    <Tab href="#" prefix={<Icon name="user" />}>
      Personopplysninger
    </Tab>
    <Tab
      href="#"
      prefix={<Icon name="wallet" />}
      suffix={<Badge size="small">2</Badge>}
    >
      Betalinger
    </Tab>
    <Tab href="#" prefix={<Icon name="chat" />}>
      Meldinger
    </Tab>
  </Tabs>
);

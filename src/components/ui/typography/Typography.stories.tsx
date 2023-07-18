import { Meta } from '@storybook/react';

import { H1 } from './H1';
import { H2 } from './H2';
import { H3 } from './H3';
import { H4 } from './H4';
import { H5 } from './H5';
import { H6 } from './H6';
import { P } from './P';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: H1,
} as Meta;

const Template = (props: React.ComponentProps<typeof H1>) => <H1 {...props} />;
Template.args = undefined as undefined | React.ComponentProps<typeof H1>;

export const Heading1 = Template.bind({});
Heading1.args = {
  children: 'Konfidens til folket',
};

export const Heading2 = () => <H2>Konfidens til folket</H2>;
export const Heading3 = () => <H3>Konfidens til folket</H3>;
export const Heading4 = () => <H4>Konfidens til folket</H4>;
export const Heading5 = () => <H5>Konfidens til folket</H5>;
export const Heading6 = () => <H6>Konfidens til folket</H6>;
export const Paragraphs = () => (
  <>
    <div>
      <P size="xs">Konfidens til folket</P>
      <P size="s">Konfidens til folket</P>
      <P size="m">Konfidens til folket</P>
      <P size="l">Konfidens til folket</P>
    </div>
  </>
);

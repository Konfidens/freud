import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { Span } from '../basic/Span';

import { Callout } from './Callout';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Callout,
} as Meta;

const Template = (props: React.ComponentProps<typeof Callout>) => (
  <Callout {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Callout>;

export const Variants = () => {
  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
        maxWidth: '$160',
      }}
    >
      <Callout variant="green" iconName="calendar">
        <Span css={{ fontWeight: 500 }}>Tips!</Span> Skal du på ferie eller av
        andre grunner har behov for å blokkere tid i kalenderen? Opprett en
        aktivitet, så vil ikke andre bookinger kunne legges der.
      </Callout>
      <Callout variant="gray" iconName="calendar">
        <Span css={{ fontWeight: 500 }}>Tips!</Span> Skal du på ferie eller av
        andre grunner har behov for å blokkere tid i kalenderen? Opprett en
        aktivitet, så vil ikke andre bookinger kunne legges der.
      </Callout>
    </Div>
  );
};

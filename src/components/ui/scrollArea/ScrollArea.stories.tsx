import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { H4 } from '../typography/H4';
import { P } from '../typography/P';

import { ScrollArea } from './ScrollArea';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: ScrollArea,
} as Meta;

const Template = (props: React.ComponentProps<typeof ScrollArea>) => (
  <ScrollArea {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof ScrollArea>;

const TAGS = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export const Defaults = () => {
  return (
    <ScrollArea css={{ boxShadow: '$huge', borderRadius: '$lg' }}>
      <Div css={{ py: '$4', px: '$5' }}>
        <H4 css={{ mb: '$2' }}>Tags</H4>
        <P>The default height is 85vh and default width is 100%</P>
        {TAGS.map((tag) => (
          <P key={tag} css={{ borderTop: '1px solid $colors$gray200' }}>
            {tag}
          </P>
        ))}
      </Div>
    </ScrollArea>
  );
};

export const DefinedWidthAndHeight = () => {
  return (
    <ScrollArea
      css={{
        width: '$40',
        height: '$80',
        boxShadow: '$huge',
        borderRadius: '$lg',
      }}
    >
      <Div css={{ py: '$4', px: '$5' }}>
        <H4 css={{ mb: '$2' }}>Tags</H4>
        {TAGS.map((tag) => (
          <P key={tag} css={{ borderTop: '1px solid $colors$gray200' }}>
            {tag}
          </P>
        ))}
      </Div>
    </ScrollArea>
  );
};

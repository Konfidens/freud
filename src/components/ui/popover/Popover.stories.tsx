import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { Input } from '../input/Input';

import { Popover } from './Popover';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Popover,
} as Meta;

const Template = (props: React.ComponentProps<typeof Popover>) => (
  <Popover {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Popover>;

export const Basic = Template.bind({});
Basic.args = {
  children: <Button>Click me</Button>,
  content: <div>Lorem ipsum og så videre</div>,
};

export const Alignment = () => (
  <Div css={{ display: 'flex', py: '$16', px: '$40', gap: '$6' }}>
    <Popover align="start" content={<>Lorem ipsum og så videre</>}>
      <Button>Start</Button>
    </Popover>

    <Popover align="center" content={<>Lorem ipsum og så videre</>}>
      <Button>Center (default)</Button>
    </Popover>

    <Popover align="end" content={<>Lorem ipsum og så videre</>}>
      <Button>End</Button>
    </Popover>
  </Div>
);

export const Side = () => (
  <Div css={{ display: 'flex', py: '$16', px: '$40', gap: '$6' }}>
    <Popover side="bottom" content={<>Lorem ipsum og så videre</>}>
      <Button>Bottom (default)</Button>
    </Popover>

    <Popover side="left" content={<>Lorem ipsum og så videre</>}>
      <Button>Left</Button>
    </Popover>

    <Popover side="top" content={<>Lorem ipsum og så videre</>}>
      <Button>Top</Button>
    </Popover>

    <Popover side="right" content={<>Lorem ipsum og så videre</>}>
      <Button>Right</Button>
    </Popover>
  </Div>
);

export const Controlled = Template.bind({});
Controlled.args = {
  children: <Button>open = true</Button>,
  content: <div>Alltid åpen</div>,
  open: true,
};

export const BackgroundColor = Template.bind({});
BackgroundColor.args = {
  children: <Button>Klikk meg</Button>,
  content: <Div css={{ color: 'white' }}>Popover med bakgrunnsfarge</Div>,
  backgroundColor: '$gray700',
};

export const WideContent = Template.bind({});
WideContent.args = {
  children: <Button>Klikk meg</Button>,
  content: (
    <Div
      css={{
        width: '$128',
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      <Input width="100%" />
      <Input width="100%" />
      <Input width="100%" />
      <Input width="100%" />
    </Div>
  ),
};
export const WithCloseButton = Template.bind({});
WithCloseButton.args = {
  children: <Button>Klikk meg</Button>,
  content: <Div css={{ p: '$4' }}>Denne boksen har lukk-knapp</Div>,
  closeButton: true,
};

export const WithoutArrow = Template.bind({});
WithoutArrow.args = {
  children: <Button>Klikk meg</Button>,
  content: <Div css={{ p: '$4' }}>Denne boksen har lukk-knapp</Div>,
  hideArrow: true,
};

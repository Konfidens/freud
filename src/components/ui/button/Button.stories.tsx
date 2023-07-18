import { Meta } from '@storybook/react';
import { useState } from 'react';

import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';
import { H6 } from '../typography/H6';

import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    suffix: {
      control: { type: 'text' },
    },
    prefix: {
      control: { type: 'text' },
    },
    as: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const Template = (props: React.ComponentProps<typeof Button>) => (
  <Button {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Button>;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Meldinger',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Meldinger',
  disabled: true,
  align: 'space-between',
};

export const LinkDisabled = Template.bind({});
LinkDisabled.args = {
  children: 'Meldinger',
  disabled: true,
  href: 'https://www.google.com',
};

export const DarkGreen = Template.bind({});
DarkGreen.args = {
  children: 'Meldinger',
  color: 'green',
  align: 'space-between',
};

export const DarkGreenDisabled = Template.bind({});
DarkGreenDisabled.args = {
  children: 'Meldinger',
  color: 'green',
  disabled: true,
  align: 'space-between',
};

export const LightGreen = Template.bind({});
LightGreen.args = {
  children: 'Meldinger',
  color: 'lightGreen',
  align: 'space-between',
};

export const LightGreenDisabled = Template.bind({});
LightGreenDisabled.args = {
  children: 'Meldinger',
  color: 'lightGreen',
  disabled: true,
  align: 'space-between',
};

export const Red = Template.bind({});
Red.args = {
  children: 'Meldinger',
  color: 'red',
  align: 'space-between',
};

export const DarkRedDisabled = Template.bind({});
DarkRedDisabled.args = {
  children: 'Meldinger',
  color: 'red',
  disabled: true,
  align: 'space-between',
};

export const Yellow = Template.bind({});
Yellow.args = {
  children: 'Meldinger',
  color: 'yellow',
  align: 'space-between',
};

export const YellowDisabled = Template.bind({});
YellowDisabled.args = {
  children: 'Meldinger',
  color: 'yellow',
  disabled: true,
  align: 'space-between',
};

export const Black = Template.bind({});
Black.args = {
  children: 'Meldinger',
  color: 'black',
  align: 'space-between',
};

export const BlackDisabled = Template.bind({});
BlackDisabled.args = {
  children: 'Meldinger',
  color: 'black',
  disabled: true,
  align: 'space-between',
};

export const Transparent = Template.bind({});
Transparent.args = {
  children: 'Meldinger',
  color: 'transparent',
  align: 'space-between',
};

export const TransparentDisabled = Template.bind({});
TransparentDisabled.args = {
  children: 'Meldinger',
  color: 'transparent',
  disabled: true,
  align: 'space-between',
};

export const ExternalLink = Template.bind({});
ExternalLink.args = {
  children: 'Click me!',
  href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  align: 'space-between',
};

export const InternalLink = Template.bind({});
InternalLink.args = {
  children: 'Click me!',
  href: '/yeah/now/your/an/all/star',
  align: 'space-between',
};

export const Prefix = Template.bind({});
Prefix.args = {
  children: 'Meldinger',
  prefix: <Icon name="chat" />,
};

export const Suffix = Template.bind({});
Suffix.args = {
  children: 'Meldinger',
  suffix: <Icon name="chat" />,
};

export const Center = Template.bind({});
Center.args = {
  children: 'Meldinger',
  suffix: <Icon name="chat" />,
  align: 'center',
};

export const SpaceBetween = Template.bind({});
SpaceBetween.args = {
  children: 'Videre',
  suffix: <Icon name="chevronRight" />,
  align: 'space-between',
  css: {
    width: '$32',
  },
};

export const Left = Template.bind({});
Left.args = {
  children: 'Meldinger',
  prefix: <Icon name="chat" />,
  css: { width: '200px' },
  align: 'left',
};

export const Right = Template.bind({});
Right.args = {
  children: 'Meldinger',
  prefix: <Icon name="chat" />,
  css: { width: '200px' },
  align: 'right',
};

export const LoadingInteractive = (
  props: React.ComponentProps<typeof Button>,
) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={() => {
        setLoading(!loading);
      }}
      prefix={<Icon name="calendar" />}
      loading={loading}
      {...props}
    >
      Click me to show spinner!
    </Button>
  );
};

export const LoadingMania = Template.bind({});
LoadingMania.args = {
  children: 'Meldinger',
  prefix: <Icon name="chat" />,
  suffix: <Icon name="chat" />,
  loading: true,
};

export const LoadingInteractiveWithoutAddons = (
  props: React.ComponentProps<typeof Button>,
) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      onClick={() => {
        setLoading(!loading);
      }}
      loading={loading}
      {...props}
    >
      Click to spin! Note how width always remains the same
    </Button>
  );
};

export const Size = (_props: React.ComponentProps<typeof Button>) => {
  return (
    <Div>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Div>
  );
};

export const WithBorder = () => {
  return (
    <>
      <H6 css={{ mb: 0 }}>withBorder = false</H6>
      <Div css={{ display: 'flex', gap: '$2', mb: '$4' }}>
        <Button color="gray" prefix={<Icon name="archive" />}>
          Gray
        </Button>
        <Button color="white" prefix={<Icon name="archive" />}>
          White
        </Button>
        <Button color="lightGreen" prefix={<Icon name="archive" />}>
          Light Green
        </Button>
        <Button color="green" prefix={<Icon name="archive" />}>
          Green
        </Button>
        <Button color="yellow" prefix={<Icon name="archive" />}>
          Yellow
        </Button>
        <Button color="red" prefix={<Icon name="archive" />}>
          Red
        </Button>
        <Button color="black" prefix={<Icon name="archive" />}>
          Black
        </Button>
        <Button color="transparent" prefix={<Icon name="archive" />}>
          Transparent
        </Button>
      </Div>
      <H6 css={{ mb: 0 }}>withBorder = true</H6>
      <Div css={{ display: 'flex', gap: '$2' }}>
        <Button withBorder color="gray" prefix={<Icon name="archive" />}>
          Gray
        </Button>
        <Button withBorder color="white" prefix={<Icon name="archive" />}>
          White
        </Button>
        <Button withBorder color="lightGreen" prefix={<Icon name="archive" />}>
          Light Green
        </Button>
        <Button withBorder color="green" prefix={<Icon name="archive" />}>
          Green
        </Button>
        <Button withBorder color="yellow" prefix={<Icon name="archive" />}>
          Yellow
        </Button>
        <Button withBorder color="red" prefix={<Icon name="archive" />}>
          Red
        </Button>
        <Button withBorder color="black" prefix={<Icon name="archive" />}>
          Black
        </Button>
        <Button withBorder color="transparent" prefix={<Icon name="archive" />}>
          Transparent
        </Button>
      </Div>
    </>
  );
};

const MenuContent = () => (
  <Button color="transparent" align="left" prefix={<Icon name="printer" />}>
    Skriv ut journal
  </Button>
);

export const Menu = (_props: React.ComponentProps<typeof Button>) => {
  return (
    <Div
      css={{
        display: 'flex',
        gap: '$4',
        flexDirection: 'column',
      }}
    >
      <Button color="white" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="gray" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="red" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="yellow" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="green" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="lightGreen" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="black" menu={<MenuContent />}>
        Opprett notat
      </Button>
    </Div>
  );
};

export const MenuKitchenSink = (
  _props: React.ComponentProps<typeof Button>,
) => {
  return (
    <Div
      css={{
        display: 'flex',
        gap: '$4',
        flexDirection: 'column',
      }}
    >
      <Button size="small" color="white" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button size="medium" color="gray" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button size="large" color="red" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button
        prefix={<Icon name="archive" />}
        color="yellow"
        menu={<MenuContent />}
      >
        Opprett notat
      </Button>

      <Button
        suffix={<Icon name="archive" />}
        color="green"
        menu={<MenuContent />}
      >
        Opprett notat
      </Button>

      <Button loading color="lightGreen" menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button
        color="black"
        prefix={<Icon name="archive" />}
        loading
        menu={<MenuContent />}
      >
        Opprett notat
      </Button>

      <Button color="black" disabled menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="lightGreen" withBorder menu={<MenuContent />}>
        Opprett notat
      </Button>

      <Button color="red" withBorder menu={<MenuContent />}>
        Opprett notat
      </Button>
    </Div>
  );
};

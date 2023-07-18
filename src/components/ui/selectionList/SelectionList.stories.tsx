import { Meta } from '@storybook/react';

import { Avatar } from '../avatar/Avatar';
import { Div } from '../basic/Div';

import * as SelectionList from './SelectionList';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: SelectionList.Item,
} as Meta;

const Template = (props: React.ComponentProps<typeof SelectionList.Item>) => (
  <SelectionList.Item {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof SelectionList.Item>;

const clients = [
  {
    name: 'Tomas Albertsen Fagerbekk',
    url: '#tomas',
    selected: true,
  },
  {
    name: 'Aleksander Erichsen',
    url: '#aleksander',
    selected: false,
  },
  {
    name: 'Morten Vaale Noddeland',
    url: '#morten',
    selected: false,
  },
  {
    name: 'Anna Grut',
    url: '#anna',
    selected: false,
    imageUrl:
      'https://github.com/mortnod/dotfiles/assets/3471625/65a84c3e-321b-43ec-933f-65955d64bde1',
  },
  {
    name: 'Oskar Osteberg',
    url: '#oskar',
    selected: false,
    imageUrl:
      'https://github.com/mortnod/dotfiles/assets/3471625/bdf88e4b-b2dd-4aa7-acbb-fe93107cfcd4',
  },
  {
    name: 'Ingrid Iskake',
    url: '#ingrid',
    selected: false,
  },
];

export const Basic = () => {
  return (
    <Div css={{ maxWidth: '$80' }}>
      <SelectionList.ItemGroup>
        {clients.map((client, i) => (
          <SelectionList.Item
            key={i}
            href={client.url}
            selected={client.selected}
          >
            {client.name}
          </SelectionList.Item>
        ))}
      </SelectionList.ItemGroup>
    </Div>
  );
};

export const AsButton = () => {
  return (
    <Div css={{ maxWidth: '$80' }}>
      <SelectionList.ItemGroup>
        {clients.map((client, i) => (
          <SelectionList.Item
            key={i}
            onClick={() => {
              alert('Clicked!');
            }}
            selected={client.selected}
          >
            {client.name}
          </SelectionList.Item>
        ))}
      </SelectionList.ItemGroup>
    </Div>
  );
};

export const Prefix = () => {
  return (
    <Div css={{ maxWidth: '$80' }}>
      <SelectionList.ItemGroup>
        {clients.map((client, i) => (
          <SelectionList.Item
            key={i}
            href={client.url}
            selected={client.selected}
            prefix={
              <Avatar src={client.imageUrl} size="$6" borderRadius="$full" />
            }
          >
            {client.name}
          </SelectionList.Item>
        ))}
      </SelectionList.ItemGroup>
    </Div>
  );
};

export const Heading = () => {
  return (
    <Div css={{ maxWidth: '$80' }}>
      <SelectionList.ItemGroup>
        {clients.slice(0, 3).map((client, i) => (
          <SelectionList.Item
            key={i}
            href={client.url}
            selected={client.selected}
          >
            {client.name}
          </SelectionList.Item>
        ))}
      </SelectionList.ItemGroup>
      <SelectionList.Heading>Arkiverte</SelectionList.Heading>
      <SelectionList.ItemGroup>
        {clients.slice(3).map((client, i) => (
          <SelectionList.Item
            key={i}
            href={client.url}
            selected={client.selected}
          >
            {client.name}
          </SelectionList.Item>
        ))}
      </SelectionList.ItemGroup>
    </Div>
  );
};

export const Disabled = () => {
  return (
    <Div css={{ maxWidth: '$80' }}>
      <SelectionList.ItemGroup>
        {clients.slice(0, 3).map((client, i) => (
          <SelectionList.Item
            key={i}
            href={client.url}
            selected={client.selected}
            disabled
          >
            {client.name}
          </SelectionList.Item>
        ))}
        {clients.slice(3).map((client, i) => (
          <SelectionList.Item
            key={i}
            href={client.url}
            selected={client.selected}
          >
            {client.name}
          </SelectionList.Item>
        ))}
      </SelectionList.ItemGroup>
    </Div>
  );
};

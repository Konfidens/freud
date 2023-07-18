import { Meta } from '@storybook/react';

import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';
import { H6 } from '../typography/H6';
import { P } from '../typography/P';

import * as List from './List';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: List.Wrap,
} as Meta;

const Template = (props: React.ComponentProps<typeof List.Wrap>) => (
  <List.Wrap {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof List.Wrap>;

const clients = [
  {
    name: 'Tomas Albertsen Fagerbekk',
    url: '#tomas',
    draft: true,
    email: 'tomas@konfidens.no',
  },
  {
    name: 'Aleksander Erichsen',
    url: '#aleksander',
    draft: false,
    email: 'aleksander@konfidens.no',
  },
  {
    name: 'Morten Vaale Noddeland',
    url: '#morten',
    draft: false,
    email: 'morten@konfidens.no',
  },
  {
    name: 'Anna Grut',
    url: '#anna',
    draft: false,
    email: 'anna.grut@gmail.com',
  },
  {
    name: 'Oskar Osteberg',
    url: '#oskar',
    draft: true,
    email: 'ostefjellet@gmail.com',
  },
  {
    name: 'Ingrid Iskake',
    url: '#ingrid',
    draft: false,
    email: 'is.plz@gmail.com',
  },
];

export const ListExample = () => {
  return (
    <List.Wrap>
      <List.Separator>I dag</List.Separator>
      <List.ItemGroup>
        {clients.slice(0, 3).map((client, i) => (
          <List.Item
            key={i}
            leftContent={client.name}
            rightContent={
              client.draft ? (
                <Badge>
                  <Icon name="exclamation" />
                  Ubetalt regning
                </Badge>
              ) : undefined
            }
            href={client.url}
          />
        ))}
      </List.ItemGroup>
      <List.Separator>Neste uke</List.Separator>
      <List.ItemGroup>
        {clients.slice(3).map((client, i) => (
          <List.Item
            key={i}
            leftContent={client.name}
            rightContent={
              client.draft ? (
                <Badge>
                  <Icon name="exclamation" />
                  Ubetalt regning
                </Badge>
              ) : undefined
            }
            href={client.url}
          />
        ))}
      </List.ItemGroup>
    </List.Wrap>
  );
};

export const WithoutHref = () => {
  return (
    <List.Wrap>
      <List.Separator>I dag</List.Separator>
      <List.ItemGroup>
        {clients.slice(0, 3).map((client, i) => (
          <List.Item
            key={i}
            leftContent={client.name}
            rightContent={
              client.draft ? (
                <Badge>
                  <Icon name="exclamation" />
                  Ubetalt regning
                </Badge>
              ) : undefined
            }
          />
        ))}
      </List.ItemGroup>
      <List.Separator>Neste uke</List.Separator>
      <List.ItemGroup>
        {clients.slice(3).map((client, i) => (
          <List.Item
            key={i}
            leftContent={client.name}
            rightContent={
              client.draft ? (
                <Badge>
                  <Icon name="exclamation" />
                  Ubetalt regning
                </Badge>
              ) : undefined
            }
          />
        ))}
      </List.ItemGroup>
    </List.Wrap>
  );
};

export const WithMenu = () => {
  return (
    <List.Wrap>
      <List.ItemGroup>
        {clients.map((client, i) => (
          <List.Item
            key={i}
            leftContent={client.name}
            rightContent={
              <>
                {client.draft && (
                  <Badge>
                    <Icon name="exclamation" />
                    Ubetalt regning
                  </Badge>
                )}
              </>
            }
            href={client.url}
            menu={
              <Button color="transparent" prefix={<Icon name="archive" />}>
                Arkiver klient
              </Button>
            }
          />
        ))}
      </List.ItemGroup>
    </List.Wrap>
  );
};

export const WithRightContentAbsolute = () => {
  return (
    <List.Wrap>
      <List.ItemGroup>
        {clients.map((client, i) => (
          <List.Item
            key={i}
            leftContent={client.name}
            rightContentAbsolute
            rightContent={
              client.draft ? (
                <Badge>
                  <Icon name="exclamation" />
                  Ubetalt regning
                </Badge>
              ) : undefined
            }
            href={client.url}
          />
        ))}
      </List.ItemGroup>
    </List.Wrap>
  );
};

export const Multirow = () => {
  return (
    <List.Wrap>
      <List.ItemGroup>
        {clients.map((client, i) => (
          <List.Item
            key={i}
            leftContent={
              <div>
                <H6>{client.name}</H6>
                <P size="s">{client.email}</P>
              </div>
            }
            href={client.url}
          />
        ))}
      </List.ItemGroup>
    </List.Wrap>
  );
};

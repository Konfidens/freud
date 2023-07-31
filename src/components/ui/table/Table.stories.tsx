import { Meta } from '@storybook/react';
import { useMemo } from 'react';

import { Span } from '../basic/Span';
import { H6 } from '../typography/H6';
import { Text } from '../typography/Text';

import { Table } from './Table';
import { Column } from './types';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Table,
} as Meta;

const Template = (props: React.ComponentProps<typeof Table>) => (
  <Table {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Table>;

type Status = 'Aktiv' | 'Invitert' | 'Deaktivert';

type Colleague = {
  name: string;
  phoneNumber: string;
  email: string;
  role: 'Behandler' | 'Admin' | 'Eier';
  status: Status;
  nationalId: string;
};

const data: Colleague[] = [
  {
    name: 'Morten Noddeland',
    phoneNumber: '11111111',
    email: 'morten@konfidens.no',
    role: 'Behandler',
    status: 'Invitert',
    nationalId: '111111111',
  },
  {
    name: 'Tomas Fagerbekk',
    phoneNumber: '13579246',
    email: 'tomas@konfidens.no',
    role: 'Administrator',
    status: 'Aktiv',
    nationalId: '555555555',
  },
  {
    name: 'Aleksander Erichsen',
    phoneNumber: '86421345',
    email: 'aleksander@konfidens.no',
    role: 'Eier',
    status: 'Deaktivert',
    nationalId: '123456789',
  },
];

export const Basic = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Navn',
      },
      {
        accessorKey: 'role',
        header: 'Rolle',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    [],
  );

  return <Table columns={columns} data={data} />;
};

const StatusCell = ({ value }: { value: Status }) => {
  if (value === 'Invitert') {
    return <Span css={{ color: '$green450', fontWeight: '500' }}>{value}</Span>;
  }

  return <>{value}</>;
};

const NameCell = ({
  name,
  email,
  phoneNumber,
}: {
  name: string;
  email: string;
  phoneNumber: string;
}) => {
  return (
    <>
      <H6 as="div">{name}</H6>
      <Text css={{ color: '$textMuted' }}>
        {email} • {phoneNumber}
      </Text>
    </>
  );
};

export const CustomCell = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        cell: ({ row }) => (
          <NameCell
            name={row.getValue('name')}
            phoneNumber={row.getValue('phoneNumber')}
            email={row.getValue('email')}
          />
        ),
        header: 'Navn',
      },
      {
        accessorKey: 'role',
        header: 'Rolle',
      },
      {
        accessorKey: 'status',
        cell: (props) => <StatusCell value={props.getValue()} />,
        header: 'Status',
      },
      {
        accessorKey: 'email',
      },
      {
        accessorKey: 'phoneNumber',
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      options={{
        initialState: {
          columnVisibility: {
            phoneNumber: false,
            email: false,
          },
        },
      }}
    />
  );
};

export const CustomRow = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Navn',
      },
      {
        accessorKey: 'role',
        header: 'Rolle',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      data={data}
      rowCss={(row) => {
        const status = row.getValue('status');

        if (status === 'Deaktivert') {
          return { opacity: '0.5', bg: '$gray50' };
        }

        return undefined;
      }}
    />
  );
};

export const ColumnOptions = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Navn',
      },
      {
        accessorKey: 'nationalId',
        header: 'Fødselsnummer',
        align: 'center',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Telefonnummer',
        align: 'right',
        tabularNumbers: true,
      },
    ],
    [],
  );

  return <Table columns={columns} data={data} />;
};

export const Sorting = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Navn',
      },
      {
        accessorKey: 'role',
        header: 'Rolle',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    [],
  );

  return <Table columns={columns} data={data} sortable />;
};

export const TableLoading = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Navn',
      },
      {
        accessorKey: 'role',
        header: 'Rolle',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    [],
  );

  return <Table columns={columns} data={[]} loading />;
};

export const TableWithPlaceholder = () => {
  const columns: Column<Colleague>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Navn',
      },
    ],
    [],
  );

  return <Table columns={columns} data={[]} emptyText="Ingen navn" />;
};

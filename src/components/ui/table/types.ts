import { ColumnDef, TableOptions, Row, RowData } from '@tanstack/react-table';

import { CSS } from '../../stitches';

export type CustomColumnOptions = {
  align?: 'left' | 'center' | 'right';
  tabularNumbers?: boolean;
};

export type Column<T extends RowData> = ColumnDef<T> &
  CustomColumnOptions & {
    accessorKey: keyof T;
  };

export interface TableProps<T extends Record<string, any>> {
  data: T[];
  emptyText?: string;
  columns: Column<T>[];
  options?: Omit<TableOptions<T>, 'columns' | 'data' | 'getCoreRowModel'>;
  rowCss?: (row: Row<T>) => CSS | undefined;
  sortable?: boolean;
  css?: CSS;
  loading?: boolean;
  defaultSorting?: { id: Extract<keyof T, string>; desc: boolean }[];
}

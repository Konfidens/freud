import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { styled } from "../../../stitches";
import { Div } from "../basic/Div";
import { Span } from "../basic/Span";
import { Icon } from "../icon/Icon";

import { Cell } from "./Cell";
import { HeaderCell } from "./HeaderCell";
import { HeaderRow } from "./HeaderRow";
import { Row } from "./Row";
import { type Column, type TableProps, type CustomColumnOptions } from "./types";

const StyledTable = styled("table", {
  minWidth: "100%",
  borderRadius: "$lg",
  boxShadow:
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)", // Tailwind: shadow

  borderCollapse: "collapse",
  overflow: "hidden",
});

const getCustomColumnOptions = <T extends RowData>(columns: Column<T>[]) => {
  const options = {} as Record<keyof T, CustomColumnOptions>;
  columns.forEach(({ accessorKey, align, tabularNumbers }) => {
    options[accessorKey] = {};
    if (align) {
      options[accessorKey].align = align;
    }
    if (tabularNumbers) {
      options[accessorKey].tabularNumbers = tabularNumbers;
    }
  });
  return options;
};

export const Table = <T extends Record<string, any>>({
  css,
  columns,
  data,
  options = {},
  rowCss,
  loading,
  sortable = false,
  defaultSorting,
  emptyText,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting || []);

  const tableOptions: TableOptions<T> = useMemo(() => {
    const opts: TableOptions<T> = {
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      ...options,
    };

    if (sortable) {
      opts.getSortedRowModel = getSortedRowModel();
      opts.onSortingChange = setSorting;

      if (!opts.state) {
        opts.state = {
          sorting,
        };
      } else {
        opts.state.sorting = sorting;
      }
    }
    return opts;
  }, [sortable, columns, data, options, sorting]);

  const table = useReactTable(tableOptions);

  const customColumnOptions = useMemo(
    () => getCustomColumnOptions(columns),
    [columns]
  );

  return (
    <StyledTable css={css}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <HeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const columnId = header.column.id;

              const { align, tabularNumbers } = customColumnOptions[columnId];

              return (
                <HeaderCell
                  key={header.id}
                  align={align}
                  tabularNumbers={tabularNumbers}
                  onClick={header.column.getToggleSortingHandler()}
                  sortDirection={header.column.getIsSorted()}
                  sortable={sortable}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </HeaderCell>
              );
            })}
          </HeaderRow>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <Row key={row.id} css={rowCss ? rowCss(row) : undefined}>
            {row.getVisibleCells().map((cell) => {
              const columnId = cell.column.id;
              const { align, tabularNumbers } = customColumnOptions[columnId];

              return (
                <Cell
                  key={cell.id}
                  align={align}
                  tabularNumbers={tabularNumbers}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Cell>
              );
            })}
          </Row>
        ))}
        {!!loading && (
          <Row>
            <Cell colSpan="100%">
              <Div css={{ display: "flex", justifyContent: "center" }}>
                <Icon name="spinner" size="6" />
              </Div>
            </Cell>
          </Row>
        )}
        {!data.length && !loading && !!emptyText && (
          <Row>
            <Cell colSpan="100%">
              <Span css={{ color: "$textMuted" }}>{emptyText}</Span>
            </Cell>
          </Row>
        )}
      </tbody>
    </StyledTable>
  );
};

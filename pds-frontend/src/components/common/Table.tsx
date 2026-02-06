import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  hoverable?: boolean;
  striped?: boolean;
  compact?: boolean;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      columns,
      data,
      keyExtractor,
      onSort,
      sortColumn,
      sortDirection,
      isLoading = false,
      isEmpty = false,
      emptyMessage = 'No data available',
      hoverable = true,
      striped = true,
      compact = false,
      onRowClick,
      className,
    },
    ref
  ) => {
    const handleSort = (column: TableColumn<any>) => {
      if (!column.sortable || !onSort) return;
      const key = column.key as string;
      const newDirection =
        sortColumn === key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(key, newDirection);
    };

    const SortIcon = ({
      column,
    }: {
      column: TableColumn<any>;
    }) => {
      if (!column.sortable) return null;
      const key = column.key as string;
      if (sortColumn !== key) {
        return <div className="h-4 w-4" />;
      }
      return sortDirection === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    };

    if (isEmpty || data.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div ref={ref} className={clsx('overflow-x-auto rounded-lg border border-gray-200', className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={clsx(
                    'px-4 py-3 text-left text-sm font-semibold text-gray-900',
                    compact && 'py-2 px-3',
                    column.className,
                    column.width
                  )}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column)}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      {column.label}
                      <SortIcon column={column} />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={keyExtractor ? keyExtractor(row, rowIdx) : rowIdx}
                  className={clsx(
                    'border-b border-gray-200 transition-colors',
                    striped && rowIdx % 2 === 1 && 'bg-gray-50',
                    hoverable && 'hover:bg-blue-50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row, rowIdx)}
                >
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className={clsx(
                        'px-4 py-3 text-sm text-gray-700',
                        compact && 'py-2 px-3',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(
                          row[column.key as keyof typeof row],
                          row,
                          rowIdx
                        )
                        : (row[column.key as keyof typeof row] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export default Table;

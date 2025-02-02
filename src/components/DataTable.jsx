import React from 'react';
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

const columnHelper = createColumnHelper();

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export function DataTable({ data, onDeleteRow }) {
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => formatAmount(info.getValue())
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => format(new Date(info.getValue()), 'dd-MM-yyyy')
    }),
    columnHelper.accessor('verified', {
      header: 'Verified',
      cell: info => info.getValue() ? 'Yes' : 'No'
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <button
          onClick={() => onDeleteRow(props.row.original.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
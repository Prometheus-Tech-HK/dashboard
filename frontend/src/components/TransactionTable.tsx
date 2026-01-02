import { useMemo, useState } from 'react';
import type { Transaction } from '../services/api';
import { Maximize2, ArrowUpDown } from 'lucide-react';
import { FullScreenModal } from './FullScreenModal';
import { Skeleton } from './ui/skeleton';
import { CurrencyDisplay } from './ui/currency-display';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';

interface TransactionTableProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  isLoading?: boolean;
}

interface TableContentProps {
  dataToShow: Transaction[];
  isDarkMode: boolean;
  emptyMessage?: string;
}

const columnHelper = createColumnHelper<Transaction>();

const TableContent = ({ dataToShow, isDarkMode, emptyMessage }: TableContentProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: info => new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: info => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
            }`}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('details', {
        header: 'Details',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('reference', {
        header: 'Reference',
        cell: info => info.getValue() || '-',
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: info => (
          <span className={info.row.original.type === 'income' ? 'text-green-600' : 'text-red-600'}>
            <CurrencyDisplay
              amount={info.row.original.type === 'income' ? Math.abs(info.getValue()) : -Math.abs(info.getValue())}
              showPlus
            />
          </span>
        ),
        meta: {
          isNumeric: true,
        }
      }),
    ],
    [isDarkMode]
  );

  const table = useReactTable({
    data: dataToShow,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* Mobile View - Simplified List */}
      <div className="block sm:hidden">
        {table.getRowModel().rows.map((row) => {
          const transaction = row.original;
          return (
            <div key={row.id} className={`border-b p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{transaction.details}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.category}</p>
                </div>
                <p className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  <CurrencyDisplay
                    amount={transaction.type === 'income' ? Math.abs(transaction.amount) : -Math.abs(transaction.amount)}
                    showPlus
                  />
                </p>
              </div>
              <div className="flex justify-between items-end mt-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </p>
                {transaction.reference && (
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Ref: {transaction.reference}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View - React Table */}
      <div className="hidden sm:block">
        <table className="w-full border-collapse">
          <thead className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md`}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left font-semibold cursor-pointer select-none group ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      } ${(header.column.columnDef.meta as any)?.isNumeric ? 'text-right' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className={`flex items-center gap-1 ${(header.column.columnDef.meta as any)?.isNumeric ? 'justify-end' : ''}`}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${header.column.getIsSorted() ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-white/20'}`}>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className={isDarkMode ? 'hover:bg-white/5' : 'hover:bg-white/40'}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={`px-6 py-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ${(cell.column.columnDef.meta as any)?.isNumeric ? 'text-right' : ''
                      }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dataToShow.length === 0 && emptyMessage && (
        <div className={`p-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {emptyMessage}
        </div>
      )}
    </>
  );
};

export function TransactionTable({ transactions, isDarkMode, isLoading }: TransactionTableProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Initial sort strictly by date for data prep, but table controls its own sort state
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  // We pass ALL sorted data to the modal, but sliced data to the inline view
  // Note: The inline view will sort ONLY the sliced data if we just slice first.
  // To allow global sorting on the inline view, we ideally should pass all data to the table and let it paginate.
  // However, based on previous logic (slice(0, 50)), we stick to that for performance, 
  // keeping in mind that sorting in inline view will only sort the visible 50 items.
  const displayTransactions = sortedTransactions.slice(0, 50);

  const emptyMessage = "No transactions found for the selected filters.";

  if (isLoading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden flex flex-col`}>
        <div className={`p-4 sm:p-6 flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>

        <div className={`flex-1 overflow-auto border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="block sm:hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`border-b p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block">
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${isDarkMode ? 'bg-gray-800/40 border-white/10' : 'bg-white/60 border-white/20'} border backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden flex flex-col`}>
        <div className={`p-4 sm:p-6 flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-white/20'} border-b`}>
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Recent Transactions</h2>
          <button
            onClick={() => setIsFullScreen(true)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-white/50'}`}
            aria-label="Expand to full screen"
          >
            <Maximize2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className={`flex-1 overflow-auto h-[600px]`}>
          <TableContent
            dataToShow={displayTransactions}
            isDarkMode={isDarkMode}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>

      <FullScreenModal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        title="All Transactions"
        isDarkMode={isDarkMode}
      >
        <div className="h-full overflow-auto">
          <TableContent
            dataToShow={sortedTransactions}
            isDarkMode={isDarkMode}
            emptyMessage={emptyMessage}
          />
        </div>
      </FullScreenModal>
    </>
  );
}
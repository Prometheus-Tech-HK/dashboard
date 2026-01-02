import { useMemo, useState } from 'react';
import type { Transaction } from '../services/api';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { FullScreenModal } from './FullScreenModal';
import { formatCurrency } from '../utils/format';
import { Skeleton } from './ui/skeleton';

interface IncomeVsExpenseChartProps {
  transactions: Transaction[];
  selectedMonth: string;
  isDarkMode: boolean;
  isLoading?: boolean;
}

interface ChartDataItem {
  name: string;
  Income: number;
  Expense: number;
  NetProfit: number;
}

interface ChartContentProps {
  chartData: ChartDataItem[];
  isDarkMode: boolean;
  height?: string;
}

const ChartContent = ({ chartData, isDarkMode, height = "h-64 sm:h-80" }: ChartContentProps) => (
  <div className={`w-full ${height}`} style={height === "h-full" ? { minHeight: '500px' } : undefined}>
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
          stroke={isDarkMode ? '#4b5563' : '#6b7280'}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
          stroke={isDarkMode ? '#4b5563' : '#6b7280'}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatCurrency(value), name === 'NetProfit' ? 'Net Profit' : name]}
          contentStyle={{
            backgroundColor: isDarkMode ? '#111827' : 'white',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
          }}
          itemStyle={{
            color: isDarkMode ? '#f3f4f6' : '#111827'
          }}
          labelStyle={{
            color: isDarkMode ? '#f3f4f6' : '#111827'
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value: string) => (
            <span style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>{value === 'NetProfit' ? 'Net Profit' : value}</span>
          )}
        />
        <Bar
          dataKey="Income"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
        <Bar
          dataKey="Expense"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
        <Line
          type="monotone"
          dataKey="NetProfit"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ r: 4, fill: '#3b82f6' }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export function IncomeVsExpenseChart({ transactions, selectedMonth, isDarkMode, isLoading }: IncomeVsExpenseChartProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const chartData = useMemo(() => {
    if (selectedMonth === 'all') {
      // Group by month
      const monthlyData: { [key: string]: { income: number; expense: number } } = {};

      transactions.forEach(transaction => {
        // Safe parsing of YYYY-MM-DD string to avoid timezone issues
        // format in API is YYYY-MM-DD
        const [year, month] = transaction.date.split('-');
        const monthKey = `${year}-${month}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += Math.abs(transaction.amount);
        }
      });

      return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          name: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
          Income: data.income,
          Expense: data.expense,
          NetProfit: data.income - data.expense,
        }));
    } else {
      // Group by day
      const dailyData: { [key: string]: { income: number; expense: number } } = {};

      transactions.forEach(transaction => {
        const date = transaction.date; // Already YYYY-MM-DD

        if (!dailyData[date]) {
          dailyData[date] = { income: 0, expense: 0 };
        }

        if (transaction.type === 'income') {
          dailyData[date].income += transaction.amount;
        } else {
          dailyData[date].expense += Math.abs(transaction.amount);
        }
      });

      return Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
          name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
          Income: data.income,
          Expense: data.expense,
          NetProfit: data.income - data.expense,
        }));
    }
  }, [transactions, selectedMonth]);

  const chartTitle = selectedMonth === 'all' ? 'Income vs Expense (Monthly)' : 'Income vs Expense (Daily)';

  if (isLoading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="w-full h-64 sm:h-80 rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <div className={`${isDarkMode ? 'bg-gray-800/40 border-white/10' : 'bg-white/60 border-white/20'} border backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>{chartTitle}</h2>
          <button
            onClick={() => setIsFullScreen(true)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            aria-label="Expand to full screen"
          >
            <Maximize2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        <ChartContent chartData={chartData} isDarkMode={isDarkMode} />
      </div>

      <FullScreenModal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        title={chartTitle}
        isDarkMode={isDarkMode}
      >
        <ChartContent chartData={chartData} isDarkMode={isDarkMode} height="h-full" />
      </FullScreenModal>
    </>
  );
}
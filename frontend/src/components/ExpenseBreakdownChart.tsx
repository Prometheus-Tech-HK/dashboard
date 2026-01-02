import { useMemo, useState } from 'react';
import type { Transaction } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { FullScreenModal } from './FullScreenModal';
import { formatCurrency } from '../utils/format';
import { Skeleton } from './ui/skeleton';

interface ExpenseBreakdownChartProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  isLoading?: boolean;
}

const COLORS = [
  '#86EFAC', // Green
  '#60A5FA', // Blue
  '#FBBF24', // Yellow
  '#FB923C', // Orange
  '#A78BFA', // Purple
  '#F87171', // Red
  '#34D399', // Emerald
  '#38BDF8', // Sky
];

interface ChartDataItem {
  name: string;
  value: number;
}

interface ChartContentProps {
  chartData: ChartDataItem[];
  isDarkMode: boolean;
  height?: string;
  showZoomControls?: boolean;
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  renderCustomLabel: (entry: ChartDataItem) => string;
}

const ChartContent = ({
  chartData,
  isDarkMode,
  height = '320px',
  showZoomControls = false,
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  renderCustomLabel
}: ChartContentProps) => (
  <div className="relative">
    {showZoomControls && (
      <div className={`absolute top-0 right-0 z-10 flex gap-2 rounded-lg shadow-sm p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <button
          onClick={handleZoomOut}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          aria-label="Zoom out"
          disabled={zoomLevel <= 0.6}
        >
          <ZoomOut className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={handleResetZoom}
          className={`px-3 py-2 rounded-lg transition-colors text-sm ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          aria-label="Reset zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          aria-label="Zoom in"
          disabled={zoomLevel >= 2}
        >
          <ZoomIn className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>
    )}
    <div
      className="w-full overflow-auto"
      style={{
        height: height === '100%' ? '600px' : height,
      }}
    >
      <div
        style={{
          transform: `scale(${showZoomControls ? zoomLevel : 1})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-in-out',
          width: '100%',
          height: height === '100%' ? '600px' : height,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="40%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
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
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="square"
              wrapperStyle={{
                paddingLeft: '20px',
              }}
              formatter={(value: string) => (
                <span style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export function ExpenseBreakdownChart({ transactions, isDarkMode, isLoading }: ExpenseBreakdownChartProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const chartData = useMemo(() => {
    const categoryData: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += Math.abs(transaction.amount);
      });

    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const renderCustomLabel = (entry: ChartDataItem) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return '0%';
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  if (isLoading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="w-full h-[320px] rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <div className={`${isDarkMode ? 'bg-gray-800/40 border-white/10' : 'bg-white/60 border-white/20'} border backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Expense Breakdown by Category</h2>
          <button
            onClick={() => setIsFullScreen(true)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            aria-label="Expand to full screen"
          >
            <Maximize2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        <ChartContent
          chartData={chartData}
          isDarkMode={isDarkMode}
          zoomLevel={zoomLevel}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          renderCustomLabel={renderCustomLabel}
        />
      </div>

      <FullScreenModal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        title="Expense Breakdown by Category"
        isDarkMode={isDarkMode}
      >
        <ChartContent
          chartData={chartData}
          isDarkMode={isDarkMode}
          height="100%"
          showZoomControls
          zoomLevel={zoomLevel}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          renderCustomLabel={renderCustomLabel}
        />
      </FullScreenModal>
    </>
  );
}
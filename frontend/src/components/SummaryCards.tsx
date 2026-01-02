import { useMemo } from 'react';
import type { Transaction } from '../services/api';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { CurrencyDisplay } from './ui/currency-display';
interface SummaryCardsProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  isLoading?: boolean;
}

export function SummaryCards({ transactions, isDarkMode, isLoading }: SummaryCardsProps) {
  const summary = useMemo(() => {
    const income = (transactions as Transaction[])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = (transactions as Transaction[])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const grossProfit = income - expense;
    const profitMargin = income > 0 ? (grossProfit / income) * 100 : 0;

    return { income, expense, grossProfit, profitMargin };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 h-[104px] flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Total Income */}
      <div className={`group ${isDarkMode ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'bg-white/60 hover:bg-white/80'} backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-green-500/20`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Income</span>
          <div className={`w-12 h-12 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <CurrencyDisplay
          amount={summary.income}
          className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        />
      </div>

      {/* Total Expense */}
      <div className={`group ${isDarkMode ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'bg-white/60 hover:bg-white/80'} backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-red-500/20`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Expense</span>
          <div className={`w-12 h-12 ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <CurrencyDisplay
          amount={summary.expense}
          className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        />
      </div>

      {/* Gross Profit */}
      <div className={`group ${isDarkMode ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'bg-white/60 hover:bg-white/80'} backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-blue-500/20`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gross Profit</span>
          <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Wallet className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <CurrencyDisplay
          amount={summary.grossProfit}
          className={`text-2xl font-extrabold tracking-tight ${summary.grossProfit >= 0 ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : 'text-red-500'}`}
        />
      </div>

      {/* Profit Margin */}
      <div className={`group ${isDarkMode ? 'bg-gray-800/40 hover:bg-gray-800/60' : 'bg-white/60 hover:bg-white/80'} backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-purple-500/20`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profit Margin</span>
          <div className={`w-12 h-12 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <TrendingUp className={`w-6 h-6 ${summary.profitMargin >= 0 ? 'text-purple-500' : 'text-red-500'}`} />
          </div>
        </div>
        <p className={`text-2xl font-extrabold tracking-tight ${summary.profitMargin >= 0 ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : 'text-red-500'}`}>
          {summary.profitMargin.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
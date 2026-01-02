import { useState, useEffect } from 'react';
import { SummaryCards } from './components/SummaryCards';
import { IncomeVsExpenseChart } from './components/IncomeVsExpenseChart';
import { ExpenseBreakdownChart } from './components/ExpenseBreakdownChart';
import { TransactionTable } from './components/TransactionTable';
import { ThemeToggle } from './components/ThemeToggle';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useTransactions, useCategories, useMonths, useProjects } from './hooks/useDashboardData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { LayoutDashboard, ReceiptText } from 'lucide-react';

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const {
    data: transactions = [],
    error: transactionsError,
    refetch: refetchTransactions,
    isFetching: isTransactionsFetching
  } = useTransactions({ month: selectedMonth, category: selectedCategory, projectId: selectedProject });

  const {
    data: categories = ['all'],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories();

  const {
    data: months = ['all'],
    isLoading: monthsLoading,
    error: monthsError,
    refetch: refetchMonths
  } = useMonths();

  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects
  } = useProjects();

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleRetry = () => {
    refetchTransactions();
    refetchCategories();
    refetchMonths();
    refetchProjects();
  };

  const isLoadingInitial = (categoriesLoading || monthsLoading || projectsLoading) && categories.length === 1 && months.length === 1 && projects.length === 0;
  const hasError = (transactionsError || categoriesError || monthsError || projectsError) && transactions.length === 0;

  if (isLoadingInitial) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader size={48} className="text-blue-500" />
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ErrorDisplay
          message="Failed to load dashboard data. Please try again."
          onRetry={handleRetry}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500`}>
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-200'}`} />
        <div className={`absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl opacity-10 ${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-200'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Prometheus Tech <span className="text-blue-600">Finance</span>
              </h1>
            </div>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Finance Intelligence & Transaction Analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </div>

        {/* Global Error Display */}
        {(transactionsError || categoriesError || monthsError || projectsError) && (
          <div className="mb-8">
            <ErrorDisplay
              message="Sync interrupted. Attempting to reconnect..."
              onRetry={handleRetry}
              isDarkMode={isDarkMode}
              variant="compact"
            />
          </div>
        )}

        {/* Main Interface Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <TabsList className="p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
              <TabsTrigger value="overview">
                <LayoutDashboard />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <ReceiptText />
                Transactions
              </TabsTrigger>
            </TabsList>

            {/* Global Filters Integration */}
            <div className="flex flex-wrap items-center gap-4 p-2.5 rounded-3xl bg-white/40 dark:bg-black/10 border border-white/20 dark:border-white/5 backdrop-blur-2xl shadow-xl">
              {/* Project Filter */}
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[180px] h-10 rounded-xl bg-slate-900/90 dark:bg-white/5 text-white border-white/20 dark:border-white/10 hover:bg-slate-800/90 dark:hover:bg-white/10 transition-colors focus:ring-blue-500/20 backdrop-blur-md">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 dark:border-white/10 backdrop-blur-xl bg-slate-900/95 dark:bg-gray-900/80 text-white">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project: any) => (
                    <SelectItem key={project.id} value={String(project.id)}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Month Filter */}
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl bg-slate-900/90 dark:bg-white/5 text-white border-white/20 dark:border-white/10 hover:bg-slate-800/90 dark:hover:bg-white/10 transition-colors focus:ring-blue-500/20 backdrop-blur-md">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 dark:border-white/10 backdrop-blur-xl bg-slate-900/95 dark:bg-gray-900/80 text-white">
                  <SelectItem value="all">All Time</SelectItem>
                  {months.filter(m => m !== 'all').map(month => (
                    <SelectItem key={month} value={month}>
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] h-10 rounded-xl bg-slate-900/90 dark:bg-white/5 text-white border-white/20 dark:border-white/10 hover:bg-slate-800/90 dark:hover:bg-white/10 transition-colors focus:ring-blue-500/20 backdrop-blur-md">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/20 dark:border-white/10 backdrop-blur-xl bg-slate-900/95 dark:bg-gray-900/80 text-white">
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category === 'all' ? 'All Categories' : category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className="relative">
              {/* Summary Cards */}
              <SummaryCards
                transactions={transactions}
                isDarkMode={isDarkMode}
                isLoading={isTransactionsFetching}
              />

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
                <IncomeVsExpenseChart
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                  isDarkMode={isDarkMode}
                  isLoading={isTransactionsFetching}
                />
                <ExpenseBreakdownChart
                  transactions={transactions}
                  isDarkMode={isDarkMode}
                  isLoading={isTransactionsFetching}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            {/* Recent Transactions - Lazy rendered for performance */}
            {activeTab === 'transactions' && (
              <TransactionTable
                transactions={transactions}
                isDarkMode={isDarkMode}
                isLoading={isTransactionsFetching}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
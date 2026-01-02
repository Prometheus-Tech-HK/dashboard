export interface Transaction {
  id: string;
  date: string;
  category: string;
  details: string;
  amount: number;
  type: 'income' | 'expense';
  reference?: string;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
}

export interface MonthData {
  start: string;
  end: string;
}

interface BackendTransaction {
  id: number;
  transactionDate: string;
  category: string;
  details: string;
  moneyIn: string;
  moneyOut: string;
  type: 'INCOME' | 'EXPENSE';
  reference?: string;
  projectId: number;
}

export const fetchTransactions = async (filters: { month?: string; category?: string; projectId?: string }): Promise<Transaction[]> => {
  const params = new URLSearchParams();
  
  if (filters.month && filters.month !== 'all') {
    const [yearStr, monthStr] = filters.month.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    // Calculate start of the month
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    
    // Calculate end of the month (Start of Next Month)
    // month is 1-based. JavaScript new Date(y, m, 1) uses 0-based month index.
    // Example: month=1 (Jan). args: (year, 1, 1) -> Feb 1st.
    const endDate = new Date(year, month, 1, 0, 0, 0, 0);
    
    params.append('from', startDate.toISOString());
    params.append('to', endDate.toISOString());
  }

  if (filters.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }

  if (filters.projectId && filters.projectId !== 'all') {
    params.append('projectId', filters.projectId);
  }

  const response = await fetch(`/api/transactions?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const data: BackendTransaction[] = await response.json();
  
  return data.map((t) => {
    const d = new Date(t.transactionDate);
    const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    return {
      id: t.id.toString(),
      date: localDate,
      category: t.category,
      details: t.details,
      amount: t.type === 'INCOME' ? parseFloat(t.moneyIn) : -parseFloat(t.moneyOut),
      type: t.type === 'INCOME' ? 'income' : 'expense',
      reference: t.reference,
      projectId: t.projectId,
    };
  });
};

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch('/api/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await response.json();
  return data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return ['all', ...data];
};

export const fetchMonths = async (): Promise<string[]> => {
  const response = await fetch('/api/months');
  if (!response.ok) {
    throw new Error('Failed to fetch months');
  }
  const data: MonthData[] = await response.json();
  
  // Convert { start, end } to "YYYY-MM" format used by frontend
  const months = data.map(m => {
    const date = new Date(m.start);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
  
  // Frontend expects 'all' and decent sort order
  return ['all', ...months.sort().reverse()];
};

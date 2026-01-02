import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchCategories, fetchMonths, fetchProjects } from '../services/api';

export const useTransactions = (filters: { month?: string; category?: string; projectId?: string }) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useMonths = () => {
  return useQuery({
    queryKey: ['months'],
    queryFn: fetchMonths,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

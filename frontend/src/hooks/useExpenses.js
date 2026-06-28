import { useState, useCallback } from 'react';
import expenseService from '../services/expenseService';
import toast from 'react-hot-toast';

// Helper to convert HTML date inputs (YYYY-MM-DD) to API format (DD-MM-YYYY)
const formatDateForBackend = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

// Helper to safely parse API string date format ("27 June 2026, 11:30 AM") for client-side sorting
const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const cleanStr = dateStr.replace(',', '');
  const parsed = Date.parse(cleanStr);
  return isNaN(parsed) ? new Date(0) : new Date(parsed);
};

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage] = useState(8); // 8 items per page looks excellent in standard dashboard cards
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    sortBy: 'newest',
    startDate: '',
    endDate: '',
  });

  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalExpenses: 0,
    averageExpense: 0,
    highestExpense: 0,
    totalCount: 0,
    monthlyBreakdown: []
  });

  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch Analytics from server and calculate overall aggregates
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const res = await expenseService.getAnalytics();
      const monthlyData = res.analytics || [];
      
      // Calculate overall aggregates from monthly records
      let totalAmount = 0;
      let maxSpent = 0;
      let totalCount = 0;

      monthlyData.forEach(item => {
        totalAmount += item.total_amount || 0;
        totalCount += item.number_of_expenses || 0;
        if ((item.max_spent || 0) > maxSpent) {
          maxSpent = item.max_spent;
        }
      });

      setAnalytics({
        totalExpenses: totalAmount,
        averageExpense: totalCount > 0 ? (totalAmount / totalCount) : 0,
        highestExpense: maxSpent,
        totalCount: totalCount,
        monthlyBreakdown: monthlyData
      });
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Fetch Expenses with current pagination and filter parameters
  const fetchExpenses = useCallback(async (customPage = page, activeFilters = filters) => {
    try {
      setLoading(true);
      let res;

      const hasDateRange = activeFilters.startDate && activeFilters.endDate;

      if (hasDateRange) {
        const start = formatDateForBackend(activeFilters.startDate);
        const end = formatDateForBackend(activeFilters.endDate);
        res = await expenseService.filterExpensesByDate(start, end, customPage, perPage);
      } else if (activeFilters.search.trim()) {
        res = await expenseService.searchExpenses(activeFilters.search, customPage, perPage);
      } else if (activeFilters.category !== 'All') {
        // Query search with the category name since backend has no separate category endpoint
        res = await expenseService.searchExpenses(activeFilters.category, customPage, perPage);
      } else {
        res = await expenseService.getExpenses(customPage, perPage);
      }

      let items = res.data || [];

      // Secondary client-side filters for robust user experience
      if (activeFilters.category !== 'All' && hasDateRange) {
        items = items.filter(
          item => item.category?.toLowerCase() === activeFilters.category.toLowerCase()
        );
      }

      // Handle Client-Side Sorting
      if (activeFilters.sortBy === 'oldest') {
        items = [...items].sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at));
      } else if (activeFilters.sortBy === 'amount_desc') {
        items = [...items].sort((a, b) => b.amount - a.amount);
      } else if (activeFilters.sortBy === 'amount_asc') {
        items = [...items].sort((a, b) => a.amount - b.amount);
      } else {
        // 'newest' (default)
        items = [...items].sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
      }

      setExpenses(items);
      setTotalPages(res.pagination?.total_pages || 1);
      setTotalItems(res.pagination?.total_items || 0);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 404 is returned by Flask when a page or search yields zero records
        setExpenses([]);
        setTotalPages(1);
        setTotalItems(0);
        setError(null);
      } else {
        setError(err.response?.data?.errors || err.response?.data?.message || 'Failed to load expenses');
      }
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  // Add a new expense
  const addExpense = async (data) => {
    try {
      await expenseService.createExpense(data);
      toast.success('Expense added successfully!');
      fetchExpenses(1); // Refresh on page 1
      fetchAnalytics(); // Refresh analytics
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.amount || err.response?.data?.errors?.title || err.response?.data?.message || 'Failed to add expense';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update an existing expense
  const updateExpense = async (id, data) => {
    try {
      await expenseService.updateExpense(id, data);
      toast.success('Expense updated successfully!');
      fetchExpenses(page); // Stay on the current page
      fetchAnalytics(); // Refresh analytics
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.amount || err.response?.data?.errors?.title || err.response?.data?.message || 'Failed to update expense';
      toast.error(errorMsg);
      return false;
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      toast.success('Expense deleted successfully!');
      
      // If we deleted the last item on this page, go back a page
      const isLastItem = expenses.length === 1;
      const targetPage = isLastItem && page > 1 ? page - 1 : page;
      
      if (isLastItem && page > 1) {
        setPage(targetPage);
      } else {
        fetchExpenses(targetPage);
      }
      
      fetchAnalytics();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
      return false;
    }
  };

  return {
    expenses,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalItems,
    filters,
    setFilters,
    analytics,
    analyticsLoading,
    fetchExpenses,
    fetchAnalytics,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};

export default useExpenses;

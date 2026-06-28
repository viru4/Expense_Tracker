import React, { useState, useEffect } from 'react';
import useExpenses from '../hooks/useExpenses';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import Pagination from '../components/expenses/Pagination';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { Plus, DollarSign, Calendar, TrendingUp, Award, Layers } from 'lucide-react';

const Dashboard = () => {
  const {
    expenses,
    loading,
    page,
    setPage,
    totalPages,
    totalItems,
    filters,
    setFilters,
    analytics,
    fetchExpenses,
    fetchAnalytics,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Load initial data on mount
  useEffect(() => {
    fetchExpenses(1);
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle individual filter value adjustments
  const handleFilterChange = (name, value) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    setPage(1);
    fetchExpenses(1, updatedFilters);
  };

  // Reset all filters back to default values
  const handleResetFilters = () => {
    const reset = {
      search: '',
      category: 'All',
      sortBy: 'newest',
      startDate: '',
      endDate: '',
    };
    setFilters(reset);
    setPage(1);
    fetchExpenses(1, reset);
  };

  // Navigate through paginated pages
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchExpenses(newPage);
  };

  // Open creation modal
  const handleAddClick = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  // Open editing modal prefilled with target details
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  // Handle form submission completion
  const handleFormSubmit = async (data) => {
    let success = false;
    if (editingExpense) {
      success = await updateExpense(editingExpense.id, data);
    } else {
      success = await addExpense(data);
    }
    if (success) {
      setModalOpen(false);
      setEditingExpense(null);
    }
  };

  const formatUSD = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  return (
    <div className="flex h-screen bg-[#070a13] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Drawer navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Dashboard title row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-widest text-slate-100 uppercase">
                  Overview
                </h1>
                <p className="text-xs text-slate-400 mt-1">Manage and track your cashflow analytics</p>
              </div>
              <button
                onClick={handleAddClick}
                className="inline-flex items-center justify-center px-4.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-brand-600/15 hover:shadow-brand-600/25 select-none"
              >
                <Plus size={14} className="mr-1.5" />
                Add Expense
              </button>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* Card 1: Total Spent */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute right-4 top-4 rounded-xl bg-brand-500/10 p-2.5 text-brand-400 border border-brand-500/10">
                  <DollarSign size={16} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Expenses
                </p>
                <h3 className="text-xl font-bold text-slate-100 mt-3 tracking-tight">
                  {formatUSD(analytics.totalExpenses)}
                </h3>
                <p className="text-[9px] text-slate-500 mt-1">Overall lifetime spend</p>
              </div>

              {/* Card 2: Average Spent */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute right-4 top-4 rounded-xl bg-blue-500/10 p-2.5 text-blue-400 border border-blue-500/10">
                  <TrendingUp size={16} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Average Expense
                </p>
                <h3 className="text-xl font-bold text-slate-100 mt-3 tracking-tight">
                  {formatUSD(analytics.averageExpense)}
                </h3>
                <p className="text-[9px] text-slate-500 mt-1">Mean value per transaction</p>
              </div>

              {/* Card 3: Highest Spent */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute right-4 top-4 rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/10">
                  <Award size={16} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Highest Expense
                </p>
                <h3 className="text-xl font-bold text-slate-100 mt-3 tracking-tight">
                  {formatUSD(analytics.highestExpense)}
                </h3>
                <p className="text-[9px] text-slate-500 mt-1">Single maximum spend item</p>
              </div>

              {/* Card 4: Total Counts */}
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute right-4 top-4 rounded-xl bg-purple-500/10 p-2.5 text-purple-400 border border-purple-500/10">
                  <Layers size={16} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Logged
                </p>
                <h3 className="text-xl font-bold text-slate-100 mt-3 tracking-tight">
                  {analytics.totalCount}
                </h3>
                <p className="text-[9px] text-slate-500 mt-1">Total items processed</p>
              </div>

            </div>

            {/* Filters panel */}
            <ExpenseFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Listing panel */}
            <div className="space-y-4">
              {loading ? (
                <Loader />
              ) : expenses.length === 0 ? (
                <EmptyState
                  message={
                    filters.search || filters.category !== 'All' || filters.startDate
                      ? 'No results match your criteria'
                      : 'No expenses logged yet'
                  }
                  submessage={
                    filters.search || filters.category !== 'All' || filters.startDate
                      ? 'Try modifying your search queries, category filter, or dates.'
                      : 'Create your very first expense entry using the Add Expense button above.'
                  }
                  onAddClick={
                    filters.search || filters.category !== 'All' || filters.startDate
                      ? null
                      : handleAddClick
                  }
                />
              ) : (
                <>
                  <ExpenseList
                    expenses={expenses}
                    onEdit={handleEditClick}
                    onDelete={deleteExpense}
                  />
                  
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>

          </div>
        </main>

      </div>

      {/* Creation / Editing Modal */}
      {modalOpen && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setModalOpen(false);
            setEditingExpense(null);
          }}
        />
      )}

    </div>
  );
};

export default Dashboard;

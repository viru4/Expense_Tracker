import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { EXPENSE_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';

/**
 * Filter panel for searching, sorting, and date range inputs.
 * @param {object} filters Active filter state.
 * @param {function} onFilterChange Change handler callback.
 * @param {function} onReset Reset callback.
 */
const ExpenseFilters = ({ filters, onFilterChange, onReset }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'All' || 
    filters.sortBy !== 'newest' || 
    filters.startDate || 
    filters.endDate;

  return (
    <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
          Filters & Search
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors cursor-pointer select-none"
          >
            <RefreshCw size={11} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        
        {/* Keyword Search */}
        <div className="relative">
          <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Search Term
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="e.g. Groceries..."
              className="w-full rounded-xl border border-slate-850 bg-slate-950 pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-slate-400">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Sort Order
          </label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date selection */}
        <div>
          <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
          />
        </div>

        {/* End Date selection */}
        <div>
          <label className="block text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
};

export default ExpenseFilters;

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

/**
 * Expense modal form for both creation and editing.
 * @param {object} expense If editing, the active expense record; otherwise undefined.
 * @param {function} onSubmit Submit callback.
 * @param {function} onClose Dismiss callback.
 */
const ExpenseForm = ({ expense, onSubmit, onClose }) => {
  const isEdit = !!expense;
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      category: 'Food',
    },
  });

  useEffect(() => {
    if (expense) {
      setValue('title', expense.title);
      setValue('amount', expense.amount);
      setValue('category', expense.category || 'Food');
    }
  }, [expense, setValue]);

  const handleFormSubmit = async (data) => {
    const payload = {
      title: data.title.trim(),
      amount: parseFloat(data.amount),
      category: data.category
    };
    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 px-6 py-4">
          <h3 className="text-base font-bold text-slate-100 tracking-wide uppercase">
            {isEdit ? 'Edit Expense' : 'Log New Expense'}
          </h3>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          
          {/* Title input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Description / Title
            </label>
            <input
              type="text"
              placeholder="e.g., Whole Foods Grocery"
              className={`w-full rounded-xl border bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all ${
                errors.title ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'
              }`}
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 100, message: 'Must be under 100 characters' },
                validate: (v) => v.trim().length > 0 || 'Title cannot be blank',
              })}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.title.message}</p>
            )}
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Amount (USD)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              className={`w-full rounded-xl border bg-slate-950 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all ${
                errors.amount ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'
              }`}
              {...register('amount', {
                required: 'Amount is required',
                valueAsNumber: true,
                validate: {
                  positive: (v) => v > 0 || 'Amount must be greater than 0',
                  number: (v) => !isNaN(v) || 'Amount must be a valid number',
                },
              })}
            />
            {errors.amount && (
              <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.amount.message}</p>
            )}
          </div>

          {/* Category dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer"
              {...register('category')}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Row */}
          <div className="flex space-x-3 pt-4 border-t border-slate-800/60 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-brand-600/15 hover:shadow-brand-600/25 text-center flex items-center justify-center"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Log Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;

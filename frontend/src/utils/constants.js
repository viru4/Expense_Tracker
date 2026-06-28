export const API_URL = import.meta.env.VITE_API_URL || '';

export const EXPENSE_CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'Transport', label: 'Transportation', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'Utilities', label: 'Utilities', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { id: 'Entertainment', label: 'Entertainment & Leisure', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'Healthcare', label: 'Healthcare & Medical', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { id: 'Shopping', label: 'Shopping', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { id: 'Housing', label: 'Housing & Rent', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  { id: 'Education', label: 'Education', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { id: 'Other', label: 'Other', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'amount_desc', label: 'Amount: High to Low' },
  { value: 'amount_asc', label: 'Amount: Low to High' },
];

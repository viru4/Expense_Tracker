import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

/**
 * Renders a single expense item block with an inline delete safety flow.
 * @param {object} expense The active expense record.
 * @param {function} onEdit Callback triggering edit modal prefill.
 * @param {function} onDelete Callback executing the delete transaction.
 */
const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { id, title, amount, category, created_at } = expense;

  const categoryObj = EXPENSE_CATEGORIES.find(c => c.id === category) || {
    label: category || 'Other',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-850 bg-slate-900/30 p-5 hover:border-slate-800 transition-all duration-200">
      {confirmDelete ? (
        <div className="flex h-full flex-col justify-between space-y-4 animate-fadeIn">
          <div className="flex items-start space-x-3 text-rose-450">
            <AlertTriangle className="flex-shrink-0 mt-0.5 text-rose-400" size={18} />
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Remove item?</h4>
              <p className="text-xs text-slate-400 mt-1 truncate">"{title}" will be deleted.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-850 cursor-pointer"
            >
              Keep
            </button>
            <button
              onClick={() => onDelete(id)}
              className="flex-1 rounded-xl bg-rose-600/90 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose-600 cursor-pointer shadow-sm shadow-rose-600/15"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between space-y-4">
          {/* Top content row */}
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <span className={`inline-block rounded-lg border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest ${categoryObj.color}`}>
                {categoryObj.label}
              </span>
              <h4 className="text-sm font-semibold text-slate-200 tracking-wide line-clamp-2 mt-1.5 leading-snug">
                {title}
              </h4>
            </div>
            <span className="text-sm font-bold text-slate-100 tracking-tight">
              {formattedAmount}
            </span>
          </div>

          {/* Details & Action row */}
          <div className="flex items-center justify-between border-t border-slate-850 pt-3">
            <div className="flex items-center space-x-1.5 text-slate-500 select-none">
              <Calendar size={12} className="text-slate-500" />
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                {created_at || 'No Date'}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(expense)}
                title="Edit expense"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-white cursor-pointer transition-colors"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete expense"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-rose-400 cursor-pointer transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;

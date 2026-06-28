import React from 'react';
import { Inbox, Plus } from 'lucide-react';

/**
 * EmptyState layout shown when no records are returned.
 * @param {string} message Primary heading.
 * @param {string} submessage Supporting instruction.
 * @param {function} onAddClick Optional click handler for a call-to-action button.
 */
const EmptyState = ({ 
  message = 'No expenses found', 
  submessage = 'Try adjusting your filters, modifying your search, or log a new expense.', 
  onAddClick 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-center max-w-md mx-auto my-8 animate-fadeIn">
      <div className="p-4 bg-slate-900/40 rounded-full border border-slate-800 text-slate-500 mb-4 flex items-center justify-center">
        <Inbox size={36} className="text-brand-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{message}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{submessage}</p>
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-brand-500/25 hover:scale-[1.02] cursor-pointer"
        >
          <Plus size={16} className="mr-1.5" />
          Add Expense
        </button>
      )}
    </div>
  );
};

export default EmptyState;

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Server-side pagination navigator.
 * @param {number} currentPage Active page index.
 * @param {number} totalPages Overall page boundary count.
 * @param {function} onPageChange Click callback carrying target index.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 py-8 border-t border-slate-850/60 mt-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900/40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
        title="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Index Label */}
      <span className="text-xs font-bold text-slate-400 tracking-wider select-none uppercase">
        Page <span className="text-slate-200">{currentPage}</span> of <span className="text-slate-200">{totalPages}</span>
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900/40 disabled:hover:text-slate-400 transition-colors cursor-pointer"
        title="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;

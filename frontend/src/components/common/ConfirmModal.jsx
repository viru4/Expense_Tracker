import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable confirmation modal with a destructive-action style.
 * @param {boolean} isOpen     - Controls modal visibility.
 * @param {function} onClose   - Called when the modal is dismissed.
 * @param {function} onConfirm - Called when the user confirms.
 * @param {string} title       - Modal heading.
 * @param {string} message     - Descriptive body text.
 * @param {string} confirmText - Text for the confirm button.
 * @param {boolean} loading    - Disables the confirm button while processing.
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  loading = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-md mx-4 glass-panel rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/15 mb-4">
          <AlertTriangle size={20} className="text-rose-400" />
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-slate-100 tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-800 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting…
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

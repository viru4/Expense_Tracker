import React, { useState } from 'react';
import { Home, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ConfirmModal from '../common/ConfirmModal';
import toast from 'react-hot-toast';

/**
 * Responsive Sidebar component.
 * @param {boolean} isOpen Toggle state for mobile drawer.
 * @param {function} onClose Dismiss callback for mobile drawer.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully.');
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete account.';
      toast.error(msg);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950 p-6 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Dismiss Header */}
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Navigation</span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onClose(); }}
              className="flex items-center space-x-3 rounded-xl bg-brand-500/10 border border-brand-500/15 text-brand-300 px-4 py-3 text-sm font-semibold tracking-wide"
            >
              <Home size={18} />
              <span>Dashboard</span>
            </a>
          </nav>
        </div>

        {/* Bottom Profile / Utility Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs select-none">
                OK
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">System Status</p>
                <p className="text-[10px] text-slate-400 tracking-wide mt-0.5">Connected to local API</p>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/10 p-4 flex flex-col space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Logged in as</span>
                <span className="text-sm font-bold text-slate-200 truncate block">{user.username}</span>
              </div>

              {/* Delete Account Button */}
              <button
                id="delete-account-btn"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center space-x-2 w-full rounded-xl border border-rose-500/15 bg-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500/30 text-rose-400 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Delete Account</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Your Account?"
        message="This will permanently delete your account and all associated expense data. This action cannot be undone."
        confirmText="Delete Account"
        loading={deleting}
      />
    </>
  );
};

export default Sidebar;


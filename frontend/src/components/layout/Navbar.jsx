import React from 'react';
import { Menu, LogOut, Wallet } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

/**
 * Top header navbar.
 * @param {function} onMenuClick Toggle callback for mobile drawer menu.
 */
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/75 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden cursor-pointer transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 shadow-md shadow-brand-500/20">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider text-white">
              SPENTLY
            </span>
          </div>
        </div>

        {/* User Context & Action Section */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-200 leading-tight">{user.username}</span>
                <span className="text-xs text-slate-400 leading-none mt-0.5">{user.email}</span>
              </div>
              
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 font-bold text-sm select-none shadow-inner">
                {getInitials(user.username)}
              </div>
              
              <div className="h-5 w-px bg-slate-800"></div>

              <button
                onClick={logout}
                title="Logout"
                className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 px-3.5 py-2 text-xs text-slate-400 font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A premium animated spinner component.
 * @param {boolean} fullPage If true, mounts as an overlay spanning the entire browser viewport.
 */
const Loader = ({ fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <div className="absolute inset-0 h-10 w-10 rounded-full bg-brand-500/20 blur-md animate-pulse"></div>
        <Loader2 className="h-10 w-10 animate-spin text-brand-400 relative z-10" />
      </div>
      <p className="text-sm font-medium text-slate-400 tracking-wider">Loading details...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex py-20 justify-center items-center w-full">
      {spinner}
    </div>
  );
};

export default Loader;

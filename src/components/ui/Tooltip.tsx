import React from 'react';
import { cn } from '../lib/utils';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ text, children, className, position = 'top' }: TooltipProps) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={cn("relative group inline-block", className)}>
      {children}
      <div className={cn(
        "absolute hidden group-hover:block z-[100] px-3 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl border border-white/10 pointer-events-none transition-all animate-in fade-in zoom-in duration-200",
        positionClasses[position]
      )}>
        {text}
        <div className={cn(
          "absolute w-2 h-2 bg-slate-900 border-white/10 rotate-45",
          position === 'top' && "left-1/2 -translate-x-1/2 top-full -mt-1 border-r border-b",
          position === 'bottom' && "left-1/2 -translate-x-1/2 bottom-full -mb-1 border-l border-t",
          position === 'left' && "top-1/2 -translate-y-1/2 left-full -ml-1 border-t border-r",
          position === 'right' && "top-1/2 -translate-y-1/2 right-full -mr-1 border-b border-l",
        )} />
      </div>
    </div>
  );
};

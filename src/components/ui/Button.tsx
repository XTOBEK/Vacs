import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98]",
      secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-[0.98]",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900 active:scale-[0.98]",
      ghost: "bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900",
      danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20 active:scale-[0.98]",
      success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-4 text-[10px] font-black uppercase tracking-widest",
      md: "h-11 px-6 text-xs font-black uppercase tracking-widest",
      lg: "h-14 px-10 text-sm font-black uppercase tracking-widest",
      icon: "h-10 w-10 p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

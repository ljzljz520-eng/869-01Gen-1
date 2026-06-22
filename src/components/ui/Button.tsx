import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  glow?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25',
  secondary: 'bg-slate-700 text-white hover:bg-slate-600',
  outline: 'border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10',
  ghost: 'text-slate-300 hover:bg-slate-700/50',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
  xl: 'px-10 py-4 text-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cyan-400/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          glow && 'shadow-lg shadow-cyan-500/40 animate-pulse-slow',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

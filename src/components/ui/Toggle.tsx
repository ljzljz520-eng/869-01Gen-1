import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer select-none">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-14 h-8 rounded-full transition-all duration-300',
              checked
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-700',
              className
            )}
          />
          <div
            className={cn(
              'absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md',
              checked && 'translate-x-6'
            )}
          />
        </div>
        {label && (
          <span className="ml-3 text-base font-medium text-slate-200">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
